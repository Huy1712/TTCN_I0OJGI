import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/db';
import { sendResponse } from '../utils/response';

type AddressInput = {
  recipientName?: unknown;
  phone?: unknown;
  province?: unknown;
  ward?: unknown;
  addressLine?: unknown;
  isDefault?: unknown;
};

type AddressValues = {
  recipientName: string;
  phone: string;
  province: string;
  ward: string;
  addressLine: string;
};

const getUserId = (req: Request): number | null => {
  const userId = Number((req.session as any)?.userId);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
};

const addressFields = [
  'recipientName',
  'phone',
  'province',
  'ward',
  'addressLine',
] as const;

function parseAddress(input: AddressInput): { values: AddressValues | null; message: string | null };
function parseAddress(input: AddressInput, partial: true): { values: Partial<AddressValues> | null; message: string | null };
function parseAddress(
  input: AddressInput,
  partial = false
): { values: AddressValues | Partial<AddressValues> | null; message: string | null } {
  const values: Partial<AddressValues> = {};
  for (const field of addressFields) {
    const value = input[field];
    if (value === undefined && partial) continue;
    if (typeof value !== 'string' || value.trim().length === 0) {
      return { values: null, message: 'Vui lòng nhập đầy đủ thông tin địa chỉ.' };
    }
    const trimmed = value.trim();
    const maxLength = field === 'addressLine' ? 255 : field === 'phone' ? 20 : 100;
    if (trimmed.length > maxLength) {
      return { values: null, message: `Thông tin ${field} vượt quá độ dài cho phép.` };
    }
    values[field] = trimmed;
  }
  if (partial) return { values, message: null };
  return { values: values as AddressValues, message: null };
}

const requireUser = (req: Request, res: Response): number | null => {
  const userId = getUserId(req);
  if (!userId) {
    sendResponse(res, 401, false, 'Vui lòng đăng nhập để tiếp tục.', null, 'UNAUTHORIZED');
    return null;
  }
  return userId;
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { fullName, phone } = req.body ?? {};
  if (typeof fullName !== 'string' || !fullName.trim() || fullName.trim().length > 100) {
    sendResponse(res, 400, false, 'Họ tên là bắt buộc và không được vượt quá 100 ký tự.', null, 'INVALID_FULL_NAME');
    return;
  }
  if (phone !== null && phone !== undefined && (typeof phone !== 'string' || phone.trim().length > 20)) {
    sendResponse(res, 400, false, 'Số điện thoại không hợp lệ.', null, 'INVALID_PHONE');
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { fullName: fullName.trim(), phone: typeof phone === 'string' && phone.trim() ? phone.trim() : null },
      select: { id: true, email: true, fullName: true, phone: true, role: true, createdAt: true, updatedAt: true },
    });
    sendResponse(res, 200, true, 'Cập nhật hồ sơ thành công.', user);
  } catch (error) {
    next(error);
  }
};

export const listAddresses = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    sendResponse(res, 200, true, 'Lấy danh sách địa chỉ thành công.', addresses);
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const body: AddressInput = req.body ?? {};
  const { values, message } = parseAddress(body);
  if (!values) {
    sendResponse(res, 400, false, message ?? 'Thông tin địa chỉ không hợp lệ.', null, 'INVALID_ADDRESS');
    return;
  }
  if (body.isDefault !== undefined && typeof body.isDefault !== 'boolean') {
    sendResponse(res, 400, false, 'Trạng thái địa chỉ mặc định không hợp lệ.', null, 'INVALID_DEFAULT_ADDRESS');
    return;
  }
  const isDefault = body.isDefault === true;

  try {
    const address = await prisma.$transaction(async (transaction) => {
      const count = await transaction.address.count({ where: { userId } });
      if (isDefault || count === 0) {
        await transaction.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
      }
      const addressData = { ...values, userId, isDefault: isDefault || count === 0 };
      return transaction.address.create({
        data: addressData,
      });
    });
    sendResponse(res, 201, true, 'Thêm địa chỉ thành công.', address);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const addressId = Number(req.params.addressId);
  if (!Number.isInteger(addressId) || addressId < 1) {
    sendResponse(res, 400, false, 'Địa chỉ không hợp lệ.', null, 'INVALID_ADDRESS_ID');
    return;
  }
  const body: AddressInput = req.body ?? {};
  const { values, message } = parseAddress(body, true);
  if (!values || (Object.keys(values).length === 0 && body.isDefault === undefined)) {
    sendResponse(res, 400, false, message ?? 'Thông tin địa chỉ không hợp lệ.', null, 'INVALID_ADDRESS');
    return;
  }
  if (body.isDefault !== undefined && typeof body.isDefault !== 'boolean') {
    sendResponse(res, 400, false, 'Trạng thái địa chỉ mặc định không hợp lệ.', null, 'INVALID_DEFAULT_ADDRESS');
    return;
  }

  try {
    const address = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.address.findFirst({ where: { id: addressId, userId } });
      if (!existing) return null;
      if (body.isDefault === true) {
        await transaction.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
      }
      return transaction.address.update({
        where: { id: addressId },
        data: { ...values, ...(typeof body.isDefault === 'boolean' ? { isDefault: body.isDefault } : {}) },
      });
    });
    if (!address) {
      sendResponse(res, 404, false, 'Không tìm thấy địa chỉ.', null, 'ADDRESS_NOT_FOUND');
      return;
    }
    sendResponse(res, 200, true, 'Cập nhật địa chỉ thành công.', address);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const addressId = Number(req.params.addressId);
  if (!Number.isInteger(addressId) || addressId < 1) {
    sendResponse(res, 400, false, 'Địa chỉ không hợp lệ.', null, 'INVALID_ADDRESS_ID');
    return;
  }

  try {
    const deleted = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.address.findFirst({ where: { id: addressId, userId } });
      if (!existing) return false;
      await transaction.address.delete({ where: { id: addressId } });
      if (existing.isDefault) {
        const nextDefault = await transaction.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        if (nextDefault) {
          await transaction.address.update({ where: { id: nextDefault.id }, data: { isDefault: true } });
        }
      }
      return true;
    });
    if (!deleted) {
      sendResponse(res, 404, false, 'Không tìm thấy địa chỉ.', null, 'ADDRESS_NOT_FOUND');
      return;
    }
    sendResponse(res, 200, true, 'Xóa địa chỉ thành công.', null);
  } catch (error) {
    next(error);
  }
};
