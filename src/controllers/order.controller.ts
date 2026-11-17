import { createHash, randomBytes } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import {
  NailLength,
  NailShape,
  PaymentMethod,
  Prisma,
} from '@prisma/client';
import { prisma } from '../config/db';
import { sendResponse } from '../utils/response';

type CheckoutLine = {
  productSlug: string;
  shape: NailShape;
  length: NailLength;
  quantity: number;
};

type ResolvedLine = CheckoutLine & {
  productId: number;
  productName: string;
  unitPrice: number;
  lineTotal: number;
};

class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = 'CheckoutError';
  }
}

const shapeValues: Record<string, NailShape> = {
  ALMOND: NailShape.ALMOND,
  COFFIN: NailShape.COFFIN,
  SQUARE: NailShape.SQUARE,
  STILETTO: NailShape.STILETTO,
  ROUND: NailShape.ROUND,
  OVAL: NailShape.OVAL,
  SHORT_OVAL: NailShape.SHORT_OVAL,
};

const lengthValues: Record<string, NailLength> = {
  SHORT: NailLength.SHORT,
  MEDIUM: NailLength.MEDIUM,
  LONG: NailLength.LONG,
  EXTRA_LONG: NailLength.EXTRA_LONG,
};

const getUserId = (req: Request): number | null => {
  const userId = Number((req.session as any)?.userId);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
};

const requireUser = (req: Request, res: Response): number | null => {
  const userId = getUserId(req);
  if (!userId) {
    sendResponse(
      res,
      401,
      false,
      'Vui lòng đăng nhập để thanh toán.',
      null,
      'UNAUTHORIZED'
    );
    return null;
  }
  return userId;
};

const parseCheckoutLines = (value: unknown): CheckoutLine[] => {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
    throw new CheckoutError(
      'Giỏ hàng không hợp lệ hoặc đang trống.',
      400,
      'INVALID_CART'
    );
  }

  const aggregated = new Map<string, CheckoutLine>();
  for (const rawLine of value) {
    if (!rawLine || typeof rawLine !== 'object') {
      throw new CheckoutError('Sản phẩm trong giỏ không hợp lệ.', 400, 'INVALID_CART_ITEM');
    }

    const line = rawLine as Record<string, unknown>;
    const productSlug =
      typeof line.productSlug === 'string' ? line.productSlug.trim() : '';
    const normalizedShape =
      typeof line.shape === 'string'
        ? line.shape.trim().toUpperCase().replace(/[\s-]+/g, '_')
        : '';
    const normalizedLength =
      typeof line.length === 'string'
        ? line.length.trim().toUpperCase().replace(/[\s-]+/g, '_')
        : '';
    const shape = shapeValues[normalizedShape];
    const length = lengthValues[normalizedLength];
    const quantity = line.quantity;

    if (
      !productSlug ||
      productSlug.length > 255 ||
      !shape ||
      !length ||
      !Number.isInteger(quantity) ||
      (quantity as number) < 1 ||
      (quantity as number) > 99
    ) {
      throw new CheckoutError(
        'Một sản phẩm có cấu hình hoặc số lượng không hợp lệ.',
        400,
        'INVALID_CART_ITEM'
      );
    }

    const key = JSON.stringify([productSlug, shape, length]);
    const existing = aggregated.get(key);
    const nextQuantity = (existing?.quantity ?? 0) + (quantity as number);
    if (nextQuantity > 99) {
      throw new CheckoutError(
        'Số lượng mỗi cấu hình không được vượt quá 99.',
        400,
        'INVALID_QUANTITY'
      );
    }
    aggregated.set(key, {
      productSlug,
      shape,
      length,
      quantity: nextQuantity,
    });
  }

  return [...aggregated.values()];
};

const getCouponCode = (value: unknown): string | null => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.trim().length > 50) {
    throw new CheckoutError('Mã giảm giá không hợp lệ.', 400, 'INVALID_COUPON');
  }
  return value.trim().toUpperCase();
};

const buildCheckoutQuote = async (
  transaction: Prisma.TransactionClient,
  userId: number,
  lines: CheckoutLine[],
  couponCode: string | null
) => {
  const products = await transaction.product.findMany({
    where: {
      slug: { in: lines.map((line) => line.productSlug) },
      status: 'ACTIVE',
    },
  });
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));
  const resolvedLines: ResolvedLine[] = lines.map((line) => {
    const product = productsBySlug.get(line.productSlug);
    if (!product) {
      throw new CheckoutError(
        'Có sản phẩm không còn kinh doanh hoặc không tồn tại.',
        409,
        'PRODUCT_UNAVAILABLE'
      );
    }
    if (
      !product.shapeOptions.includes(line.shape) ||
      !product.lengthOptions.includes(line.length)
    ) {
      throw new CheckoutError(
        `Cấu hình của sản phẩm "${product.name}" không còn khả dụng.`,
        409,
        'VARIANT_UNAVAILABLE'
      );
    }
    if (product.stock < line.quantity) {
      throw new CheckoutError(
        `Sản phẩm "${product.name}" không đủ tồn kho.`,
        409,
        'INSUFFICIENT_STOCK'
      );
    }

    const unitPrice = Number(product.price);
    return {
      ...line,
      productId: product.id,
      productName: product.name,
      unitPrice,
      lineTotal: unitPrice * line.quantity,
    };
  });
  const subtotal = resolvedLines.reduce((sum, line) => sum + line.lineTotal, 0);

  let coupon: {
    id: number;
    code: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    maxDiscount: number | null;
    minOrderAmount: number | null;
    startsAt: Date | null;
    endsAt: Date | null;
    usageLimit: number | null;
    perUserLimit: number | null;
    usedCount: number;
    isActive: boolean;
  } | null = null;
  let discountAmount = 0;

  if (couponCode) {
    const storedCoupon = await transaction.coupon.findFirst({
      where: { code: { equals: couponCode, mode: 'insensitive' } },
    });
    const now = new Date();
    if (
      !storedCoupon ||
      !storedCoupon.isActive ||
      (storedCoupon.startsAt && storedCoupon.startsAt > now) ||
      (storedCoupon.endsAt && storedCoupon.endsAt < now)
    ) {
      throw new CheckoutError(
        'Mã giảm giá không tồn tại, chưa đến hạn hoặc đã hết hạn.',
        400,
        'COUPON_UNAVAILABLE'
      );
    }
    if (
      storedCoupon.usageLimit !== null &&
      storedCoupon.usedCount >= storedCoupon.usageLimit
    ) {
      throw new CheckoutError('Mã giảm giá đã hết lượt sử dụng.', 400, 'COUPON_LIMIT_REACHED');
    }
    if (
      storedCoupon.minOrderAmount !== null &&
      subtotal < Number(storedCoupon.minOrderAmount)
    ) {
      throw new CheckoutError(
        `Đơn hàng cần đạt tối thiểu ${Number(
          storedCoupon.minOrderAmount
        ).toLocaleString('vi-VN')} ₫ để dùng mã này.`,
        400,
        'COUPON_MINIMUM_NOT_MET'
      );
    }
    if (storedCoupon.perUserLimit !== null) {
      const userUsageCount = await transaction.couponUsage.count({
        where: { couponId: storedCoupon.id, userId },
      });
      if (userUsageCount >= storedCoupon.perUserLimit) {
        throw new CheckoutError(
          'Bạn đã sử dụng hết số lượt được áp dụng mã này.',
          400,
          'COUPON_USER_LIMIT_REACHED'
        );
      }
    }

    const discountValue = Number(storedCoupon.discountValue);
    discountAmount =
      storedCoupon.discountType === 'PERCENT'
        ? Math.round((subtotal * discountValue) / 100)
        : discountValue;
    if (storedCoupon.maxDiscount !== null) {
      discountAmount = Math.min(discountAmount, Number(storedCoupon.maxDiscount));
    }
    discountAmount = Math.min(Math.max(0, discountAmount), subtotal);
    coupon = {
      id: storedCoupon.id,
      code: storedCoupon.code,
      discountType: storedCoupon.discountType,
      discountValue,
      maxDiscount:
        storedCoupon.maxDiscount === null
          ? null
          : Number(storedCoupon.maxDiscount),
      minOrderAmount:
        storedCoupon.minOrderAmount === null
          ? null
          : Number(storedCoupon.minOrderAmount),
      startsAt: storedCoupon.startsAt,
      endsAt: storedCoupon.endsAt,
      usageLimit: storedCoupon.usageLimit,
      perUserLimit: storedCoupon.perUserLimit,
      usedCount: storedCoupon.usedCount,
      isActive: storedCoupon.isActive,
    };
  }

  const shippingFee = subtotal >= 1_500_000 ? 0 : 30_000;
  return {
    items: resolvedLines,
    coupon,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount: Math.max(0, subtotal + shippingFee - discountAmount),
  };
};

const readCheckoutRequest = (body: unknown) => {
  if (!body || typeof body !== 'object') {
    throw new CheckoutError('Thông tin thanh toán không hợp lệ.', 400, 'INVALID_CHECKOUT');
  }
  const request = body as Record<string, unknown>;
  return {
    lines: parseCheckoutLines(request.items),
    couponCode: getCouponCode(request.couponCode),
  };
};

export const getCheckoutQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  try {
    const { lines, couponCode } = readCheckoutRequest(req.body);
    const quote = await prisma.$transaction(
      (transaction) => buildCheckoutQuote(transaction, userId, lines, couponCode),
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
    sendResponse(res, 200, true, 'Tính giá thanh toán thành công.', {
      items: quote.items.map(({ productSlug, productName, shape, length, quantity, unitPrice, lineTotal }) => ({
        productSlug,
        productName,
        shape,
        length,
        quantity,
        unitPrice,
        lineTotal,
      })),
      subtotal: quote.subtotal,
      discountAmount: quote.discountAmount,
      couponCode: quote.coupon?.code ?? null,
      shippingFee: quote.shippingFee,
      totalAmount: quote.totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

const getRequiredText = (
  value: unknown,
  fieldName: string,
  maxLength: number
): string => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new CheckoutError(`${fieldName} không hợp lệ.`, 400, 'INVALID_SHIPPING_INFO');
  }
  return value.trim();
};

const getIdempotencyKey = (value: unknown): string => {
  if (
    typeof value !== 'string' ||
    value.length > 64 ||
    !/^[A-Za-z0-9._:-]{16,64}$/.test(value)
  ) {
    throw new CheckoutError(
      'Khóa tạo đơn không hợp lệ. Vui lòng tải lại trang và thử lại.',
      400,
      'INVALID_IDEMPOTENCY_KEY'
    );
  }
  return value;
};

const getRequestHash = (input: {
  lines: CheckoutLine[];
  couponCode: string | null;
  paymentMethod: PaymentMethod;
  addressId: number | null;
  manualAddress: {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
  } | null;
  transferReference: string | null;
}) => {
  const canonicalRequest = {
    ...input,
    lines: [...input.lines].sort(
      (left, right) =>
        left.productSlug.localeCompare(right.productSlug) ||
        left.shape.localeCompare(right.shape) ||
        left.length.localeCompare(right.length)
    ),
  };
  return createHash('sha256')
    .update(JSON.stringify(canonicalRequest))
    .digest('hex');
};

const orderInclude = {
  orderItems: true,
  payments: { select: { method: true, status: true, amount: true } },
} satisfies Prisma.OrderInclude;

type CheckoutOrder = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

const getExistingOrder = (userId: number, idempotencyKey: string) =>
  prisma.order.findUnique({
    where: { userId_idempotencyKey: { userId, idempotencyKey } },
    include: orderInclude,
  });

const toOrderResponse = (order: CheckoutOrder) => ({
  id: order.id,
  orderCode: order.orderCode,
  status: order.status,
  recipientName: order.recipientName,
  recipientPhone: order.recipientPhone,
  shippingAddress: order.shippingAddress,
  subtotal: order.subtotal,
  discountAmount: order.discountAmount,
  shippingFee: order.shippingFee,
  totalAmount: order.totalAmount,
  couponCode: order.couponCode,
  createdAt: order.createdAt,
  orderItems: order.orderItems,
  payments: order.payments,
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  try {
    const { lines, couponCode } = readCheckoutRequest(req.body);
    const body = req.body as Record<string, unknown>;
    const idempotencyKey = getIdempotencyKey(body.idempotencyKey);
    const paymentMethod =
      body.paymentMethod === 'COD'
        ? PaymentMethod.COD
        : body.paymentMethod === 'BANK_TRANSFER'
          ? PaymentMethod.BANK_TRANSFER
          : null;
    if (!paymentMethod) {
      throw new CheckoutError(
        'Phương thức thanh toán không được hỗ trợ.',
        400,
        'INVALID_PAYMENT_METHOD'
      );
    }

    let addressId: number | null = null;
    let manualAddress: {
      recipientName: string;
      recipientPhone: string;
      shippingAddress: string;
    } | null = null;
    if (body.addressId !== undefined && body.addressId !== null) {
      if (!Number.isInteger(body.addressId) || (body.addressId as number) < 1) {
        throw new CheckoutError(
          'Địa chỉ nhận hàng không hợp lệ.',
          400,
          'INVALID_ADDRESS'
        );
      }
      addressId = body.addressId as number;
    } else {
      manualAddress = {
        recipientName: getRequiredText(body.recipientName, 'Tên người nhận', 100),
        recipientPhone: getRequiredText(body.recipientPhone, 'Số điện thoại', 20),
        shippingAddress: getRequiredText(body.shippingAddress, 'Địa chỉ nhận hàng', 1000),
      };
    }
    if (
      body.transferReference !== undefined &&
      body.transferReference !== null &&
      typeof body.transferReference !== 'string'
    ) {
      throw new CheckoutError(
        'Mã tham chiếu chuyển khoản không hợp lệ.',
        400,
        'INVALID_TRANSFER_REFERENCE'
      );
    }
    const transferReference =
      paymentMethod === PaymentMethod.BANK_TRANSFER &&
      typeof body.transferReference === 'string'
        ? body.transferReference.trim().slice(0, 100)
        : null;
    const requestHash = getRequestHash({
      lines,
      couponCode,
      paymentMethod,
      addressId,
      manualAddress,
      transferReference,
    });

    const existingOrder = await getExistingOrder(userId, idempotencyKey);
    if (existingOrder) {
      if (existingOrder.requestHash !== requestHash) {
        throw new CheckoutError(
          'Khóa tạo đơn này đã được dùng cho một yêu cầu thanh toán khác.',
          409,
          'IDEMPOTENCY_KEY_REUSED'
        );
      }
      sendResponse(
        res,
        200,
        true,
        'Đơn hàng đã được tạo trước đó.',
        toOrderResponse(existingOrder)
      );
      return;
    }

    const transactionResult = async () =>
      prisma.$transaction(
        async (transaction) => {
          const replay = await transaction.order.findUnique({
            where: { userId_idempotencyKey: { userId, idempotencyKey } },
            include: orderInclude,
          });
          if (replay) {
            if (replay.requestHash !== requestHash) {
              throw new CheckoutError(
                'Khóa tạo đơn này đã được dùng cho một yêu cầu thanh toán khác.',
                409,
                'IDEMPOTENCY_KEY_REUSED'
              );
            }
            return replay;
          }

          const user = await transaction.user.findUnique({
            where: { id: userId },
            select: { email: true, isActive: true },
          });
          if (!user?.isActive) {
            throw new CheckoutError(
              'Tài khoản không thể đặt hàng.',
              403,
              'ACCOUNT_INACTIVE'
            );
          }

          let recipientName: string;
          let recipientPhone: string;
          let shippingAddress: string;
          if (addressId !== null) {
            const address = await transaction.address.findFirst({
              where: { id: addressId, userId },
            });
            if (!address) {
              throw new CheckoutError(
                'Địa chỉ nhận hàng không tồn tại trong tài khoản này.',
                404,
                'ADDRESS_NOT_FOUND'
              );
            }
            recipientName = address.recipientName;
            recipientPhone = address.phone;
            shippingAddress = `${address.addressLine}, ${address.ward}, ${address.province}`;
          } else {
            if (!manualAddress) {
              throw new Error('Thông tin địa chỉ giao hàng bị thiếu.');
            }
            recipientName = manualAddress.recipientName;
            recipientPhone = manualAddress.recipientPhone;
            shippingAddress = manualAddress.shippingAddress;
          }

          const quote = await buildCheckoutQuote(
            transaction,
            userId,
            lines,
            couponCode
          );
          for (const line of quote.items) {
            const stockUpdate = await transaction.product.updateMany({
              where: {
                id: line.productId,
                status: 'ACTIVE',
                stock: { gte: line.quantity },
              },
              data: { stock: { decrement: line.quantity } },
            });
            if (stockUpdate.count !== 1) {
              throw new CheckoutError(
                `Sản phẩm "${line.productName}" vừa hết hàng hoặc không đủ tồn kho.`,
                409,
                'INSUFFICIENT_STOCK'
              );
            }
          }

          if (quote.coupon) {
            const couponUpdate = await transaction.coupon.updateMany({
              where: {
                id: quote.coupon.id,
                isActive: true,
                ...(quote.coupon.usageLimit === null
                  ? {}
                  : { usedCount: { lt: quote.coupon.usageLimit } }),
              },
              data: { usedCount: { increment: 1 } },
            });
            if (couponUpdate.count !== 1) {
              throw new CheckoutError(
                'Mã giảm giá vừa hết lượt sử dụng.',
                409,
                'COUPON_LIMIT_REACHED'
              );
            }
          }

          const order = await transaction.order.create({
            data: {
              orderCode: `NA${Date.now().toString(36).toUpperCase()}${randomBytes(3)
                .toString('hex')
                .toUpperCase()}`,
              userId,
              idempotencyKey,
              requestHash,
              status: 'PENDING',
              recipientName,
              recipientPhone,
              contactEmail: user.email,
              shippingAddress,
              subtotal: quote.subtotal,
              discountAmount: quote.discountAmount,
              shippingFee: quote.shippingFee,
              totalAmount: quote.totalAmount,
              couponCode: quote.coupon?.code,
            },
          });

          await transaction.orderItem.createMany({
            data: quote.items.map((line) => ({
              orderId: order.id,
              productId: line.productId,
              productName: line.productName,
              shape: line.shape,
              length: line.length,
              quantity: line.quantity,
              price: line.unitPrice,
            })),
          });
          await transaction.payment.create({
            data: {
              orderId: order.id,
              method: paymentMethod,
              status:
                paymentMethod === PaymentMethod.BANK_TRANSFER
                  ? 'AWAITING_VERIFICATION'
                  : 'PENDING',
              amount: quote.totalAmount,
              transferReference,
            },
          });
          if (quote.coupon) {
            await transaction.couponUsage.create({
              data: {
                couponId: quote.coupon.id,
                userId,
                orderId: order.id,
                discountAmount: quote.discountAmount,
              },
            });
          }
          await transaction.orderStatusHistory.create({
            data: { orderId: order.id, toStatus: 'PENDING' },
          });

          return transaction.order.findUniqueOrThrow({
            where: { id: order.id },
            include: orderInclude,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );

    let order;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        order = await transactionResult();
        break;
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === 'P2034' && attempt < 2) continue;
        if (code === 'P2002') {
          const replay = await getExistingOrder(userId, idempotencyKey);
          if (replay) {
            if (replay.requestHash !== requestHash) {
              throw new CheckoutError(
                'Khóa tạo đơn này đã được dùng cho một yêu cầu thanh toán khác.',
                409,
                'IDEMPOTENCY_KEY_REUSED'
              );
            }
            sendResponse(
              res,
              200,
              true,
              'Đơn hàng đã được tạo trước đó.',
              toOrderResponse(replay)
            );
            return;
          }
        }
        throw error;
      }
    }
    if (!order) {
      throw new Error('Không thể hoàn tất giao dịch đặt hàng.');
    }
    sendResponse(res, 201, true, 'Đặt hàng thành công.', toOrderResponse(order));
  } catch (error) {
    next(error);
  }
};
