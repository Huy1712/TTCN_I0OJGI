import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartEntryKey, useStudio } from "../../app/StudioContext";
import { formatVnd } from "../../config/brand";
import { useAuth } from "../auth/AuthProvider";
import { authApi, ShippingAddress } from "../auth/authApi";
import { CheckoutQuote, orderApi } from "./orderApi";

const normalizeVariant = (value: string) =>
  value.trim().toUpperCase().replace(/[\s-]+/g, "_");

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    showToast,
  } = useStudio();

  const [recipientName, setRecipientName] = useState("Nguyễn Minh Anh");
  const [recipientPhone, setRecipientPhone] = useState("0909123456");
  const [shippingAddress, setShippingAddress] = useState(
    "88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
  );
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressLoadError, setAddressLoadError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "COD">(
    "BANK_TRANSFER"
  );
  const [transferReference, setTransferReference] = useState("VCB-NA2026-LUX");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [checkoutQuote, setCheckoutQuote] = useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [createdOrderCode, setCreatedOrderCode] = useState("");
  const idempotencyKeyRef = useRef<string | null>(null);
  const quoteRequestIdRef = useRef(0);

  const checkoutItems = cart.map((entry) => ({
    productSlug: entry.product.slug,
    shape: entry.selectedShape,
    length: entry.selectedLength,
    quantity: entry.quantity,
  }));

  useEffect(() => {
    if (!user) {
      setSavedAddresses([]);
      setSelectedAddressId("");
      setLoadingAddresses(false);
      setAddressLoadError("");
      setRecipientName("Nguyễn Minh Anh");
      setRecipientPhone("0909123456");
      setShippingAddress(
        "88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
      );
      return;
    }

    let isCurrent = true;
    setSelectedAddressId("");
    setLoadingAddresses(true);
    setAddressLoadError("");
    setRecipientName(user.fullName);
    setRecipientPhone(user.phone ?? "");
    setShippingAddress("");

    authApi
      .getAddresses()
      .then((addresses) => {
        if (!isCurrent) return;
        setSavedAddresses(addresses);
        const defaultAddress =
          addresses.find((address) => address.isDefault) ?? addresses[0];
        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));
          setRecipientName(defaultAddress.recipientName);
          setRecipientPhone(defaultAddress.phone);
          setShippingAddress(
            `${defaultAddress.addressLine}, ${defaultAddress.ward}, ${defaultAddress.province}`
          );
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setAddressLoadError(
            error instanceof Error
              ? error.message
              : "Không thể tải địa chỉ đã lưu."
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoadingAddresses(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const handleSavedAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(
      (savedAddress) => String(savedAddress.id) === addressId
    );
    if (!address) {
      setRecipientName(user?.fullName ?? "");
      setRecipientPhone(user?.phone ?? "");
      setShippingAddress("");
      return;
    }

    setRecipientName(address.recipientName);
    setRecipientPhone(address.phone);
    setShippingAddress(
      `${address.addressLine}, ${address.ward}, ${address.province}`
    );
  };

  useEffect(() => {
    if (!user || cart.length === 0) {
      quoteRequestIdRef.current += 1;
      setCheckoutQuote(null);
      setQuoteError("");
      setQuoteLoading(false);
      return;
    }

    let isCurrent = true;
    const requestId = ++quoteRequestIdRef.current;
    setCheckoutQuote(null);
    setQuoteError("");
    orderApi
      .quote(
        cart.map((entry) => ({
          productSlug: entry.product.slug,
          shape: entry.selectedShape,
          length: entry.selectedLength,
          quantity: entry.quantity,
        })),
        appliedCouponCode || undefined
      )
      .then((quote) => {
        if (isCurrent && quoteRequestIdRef.current === requestId) {
          setCheckoutQuote(quote);
        }
      })
      .catch((error: unknown) => {
        if (!isCurrent || quoteRequestIdRef.current !== requestId) return;
        if (appliedCouponCode) {
          setAppliedCouponCode("");
          setCouponCode("");
          showToast(
            error instanceof Error
              ? error.message
              : "Không thể áp dụng mã giảm giá hiện tại."
          );
        } else {
          setQuoteError(
            error instanceof Error
              ? error.message
              : "Không thể kiểm tra giá và tồn kho."
          );
        }
      })
      .finally(() => {
        if (isCurrent && quoteRequestIdRef.current === requestId) {
          setQuoteLoading(false);
        }
      });
    setQuoteLoading(true);

    return () => {
      isCurrent = false;
    };
  }, [user, cart, appliedCouponCode, showToast]);

  const shippingFee =
    checkoutQuote?.shippingFee ??
    (cartSubtotal >= 1500000 || cart.length === 0 ? 0 : 30000);
  const displayedSubtotal = checkoutQuote?.subtotal ?? cartSubtotal;
  const discountAmount = checkoutQuote?.discountAmount ?? 0;
  const finalTotal =
    checkoutQuote?.totalAmount ??
    Math.max(0, displayedSubtotal + shippingFee - discountAmount);
  const getQuoteLine = (entry: (typeof cart)[number]) =>
    checkoutQuote?.items.find(
      (item) =>
        item.productSlug === entry.product.slug &&
        normalizeVariant(item.shape) === normalizeVariant(entry.selectedShape) &&
        normalizeVariant(item.length) === normalizeVariant(entry.selectedLength)
    );
  const getQuotedUnitPrice = (entry: (typeof cart)[number]) =>
    getQuoteLine(entry)?.unitPrice ?? entry.product.price;

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();
    if (!normalizedCode) {
      showToast("Vui lòng nhập mã giảm giá.");
      return;
    }
    if (!user) {
      showToast("Vui lòng đăng nhập để kiểm tra mã giảm giá.");
      return;
    }

    setQuoteLoading(true);
    const requestId = ++quoteRequestIdRef.current;
    try {
      const quote = await orderApi.quote(checkoutItems, normalizedCode);
      if (quoteRequestIdRef.current !== requestId) return;
      setCheckoutQuote(quote);
      setAppliedCouponCode(normalizedCode);
      setQuoteError("");
      showToast(
        `Đã áp dụng ${quote.couponCode}: giảm ${formatVnd(
          quote.discountAmount
        )}`
      );
    } catch (error) {
      if (quoteRequestIdRef.current !== requestId) return;
      setAppliedCouponCode("");
      setQuoteError(
        error instanceof Error ? error.message : "Không thể kiểm tra mã giảm giá."
      );
      showToast(
        error instanceof Error ? error.message : "Không thể kiểm tra mã giảm giá."
      );
    } finally {
      if (quoteRequestIdRef.current === requestId) setQuoteLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Giỏ hàng của bạn đang trống!");
      return;
    }
    if (!user) {
      showToast("Vui lòng đăng nhập để hoàn tất thanh toán.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setOrderError("");
    try {
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID();
      }
      const order = await orderApi.createOrder({
        idempotencyKey: idempotencyKeyRef.current,
        items: checkoutItems,
        paymentMethod,
        couponCode: appliedCouponCode || undefined,
        ...(selectedAddressId
          ? { addressId: Number(selectedAddressId) }
          : { recipientName, recipientPhone, shippingAddress }),
        transferReference:
          paymentMethod === "BANK_TRANSFER" ? transferReference : undefined,
      });
      clearCart();
      setCreatedOrderCode(order.orderCode);
      setAppliedCouponCode("");
      setCouponCode("");
      showToast(`Đặt hàng thành công. Mã đơn hàng: ${order.orderCode}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tạo đơn hàng.";
      setOrderError(message);
      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="font-serif-editorial text-3xl sm:text-5xl text-[#342A2A] mt-1">
          Giỏ Hàng &amp; Xác Nhận Đơn Hàng Atelier
        </h1>
      </div>

      {createdOrderCode ? (
        <div
          role="status"
          className="rounded-2xl border border-[#3E6B52]/30 bg-[#3E6B52]/10 p-5 text-sm text-[#342A2A]"
        >
          Đặt hàng thành công. Mã đơn hàng của bạn là{" "}
          <strong>{createdOrderCode}</strong>.
        </div>
      ) : null}

      {cart.length === 0 ? (
        <div className="bg-[#FFFCF8] rounded-3xl p-10 text-center border border-[#342A2A]/10 space-y-4">
          <p className="text-sm text-[#342A2A]/70">
            Giỏ hàng của bạn hiện đang trống.
          </p>
          <Link
            to="/catalog"
            className="inline-block px-6 py-3 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
          >
            Khám Phá Bộ Sưu Tập Nails
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-7 bg-[#FFFCF8] rounded-3xl p-6 sm:p-8 border border-[#342A2A]/10 space-y-5">
            <h2 className="font-serif-editorial text-2xl text-[#342A2A]">
              Sản Phẩm Đã Chọn ({cart.length})
            </h2>

            <div className="space-y-4">
              {cart.map((entry) => (
                <div
                  key={getCartEntryKey(entry)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F7F1EA] border border-[#342A2A]/10"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={entry.product.image}
                      alt={entry.product.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-serif-editorial text-2xl font-semibold text-[#342A2A]">
                        {getQuoteLine(entry)?.productName ?? entry.product.name}
                      </h3>
                      <p className="text-xs text-[#342A2A]/70">
                        Dáng móng: <strong>{entry.selectedShape}</strong> &bull;
                        Độ dài: <strong>{entry.selectedLength}</strong>
                      </p>
                      <p className="text-sm font-bold text-[#B98C68] mt-1">
                        {formatVnd(getQuotedUnitPrice(entry))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(getCartEntryKey(entry), -1)
                      }
                      className="w-8 h-8 rounded-full bg-[#FFFCF8] border border-[#342A2A]/15 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {entry.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(getCartEntryKey(entry), 1)
                      }
                      className="w-8 h-8 rounded-full bg-[#FFFCF8] border border-[#342A2A]/15 font-bold"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(getCartEntryKey(entry))}
                      className="ml-2 px-3 py-1.5 rounded-full bg-[#FFFCF8] text-xs hover:bg-[#E8B7B1]/40"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Box */}
            <div className="pt-4 border-t border-[#342A2A]/10 flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setQuoteError("");
                  if (appliedCouponCode) setAppliedCouponCode("");
                }}
                placeholder="Nhập mã giảm giá"
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={quoteLoading}
                className="px-5 py-2.5 rounded-full border border-[#B98C68] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D4C9] transition"
              >
                {quoteLoading ? "Đang kiểm tra..." : "Áp Dụng Mã"}
              </button>
            </div>
            {appliedCouponCode ? (
              <p role="status" className="text-xs text-[#3E6B52]">
                Mã {appliedCouponCode} đã được máy chủ xác nhận.
              </p>
            ) : null}
            {quoteError ? (
              <p role="alert" className="text-xs text-red-700">
                {quoteError}
              </p>
            ) : null}
          </div>

          {/* Right: Shipping & Payment Form */}
          <form
            onSubmit={handleSubmitOrder}
            className="lg:col-span-5 bg-[#FFFCF8] rounded-3xl p-6 sm:p-8 border border-[#342A2A]/10 space-y-5"
          >
            <h2 className="font-serif-editorial text-2xl text-[#342A2A]">
              Thông Tin Giao Hàng &amp; Thanh Toán
            </h2>
            {!user ? (
              <p className="rounded-xl bg-[#F7F1EA] p-3 text-xs text-[#342A2A]/75">
                Vui lòng{" "}
                <Link to="/login" className="font-semibold underline">
                  đăng nhập
                </Link>{" "}
                để xác thực địa chỉ và hoàn tất đơn hàng.
              </p>
            ) : null}
            {orderError ? (
              <p role="alert" className="text-sm text-red-700">
                {orderError}
              </p>
            ) : null}

            <div className="space-y-3.5 text-xs">
              {user ? (
                <div>
                  <label
                    htmlFor="saved-shipping-address"
                    className="block font-semibold uppercase tracking-wider mb-1"
                  >
                    Địa chỉ đã lưu
                  </label>
                  {loadingAddresses ? (
                    <p className="py-2 text-[#342A2A]/60" aria-busy="true">
                      Đang tải địa chỉ...
                    </p>
                  ) : savedAddresses.length > 0 ? (
                    <select
                      id="saved-shipping-address"
                      value={selectedAddressId}
                      onChange={(event) =>
                        handleSavedAddressChange(event.target.value)
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm"
                    >
                      <option value="">Nhập địa chỉ khác</option>
                      {savedAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.recipientName} · {address.addressLine},{" "}
                          {address.ward}, {address.province}
                          {address.isDefault ? " (Mặc định)" : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="py-2 text-[#342A2A]/60">
                      Chưa có địa chỉ đã lưu. Bạn có thể nhập địa chỉ bên dưới.
                    </p>
                  )}
                  {addressLoadError ? (
                    <p role="alert" className="mt-1 text-red-700">
                      {addressLoadError}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">
                  Người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={Boolean(selectedAddressId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  disabled={Boolean(selectedAddressId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">
                  Địa chỉ nhận hàng *
                </label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  disabled={Boolean(selectedAddressId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">
                  Phương thức thanh toán
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as "BANK_TRANSFER" | "COD"
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm"
                >
                  <option value="BANK_TRANSFER">
                    Chuyển khoản Ngân hàng (Vietcombank — Đối soát mã GD)
                  </option>
                  <option value="COD">
                    Thanh toán khi nhận hàng (COD — Kiểm tra hộp Luxury)
                  </option>
                </select>
              </div>

              {paymentMethod === "BANK_TRANSFER" ? (
                <div className="p-3.5 rounded-2xl bg-[#F7F1EA] border border-[#B98C68]/40 space-y-2">
                  <div className="font-bold text-[#342A2A]">
                    Vietcombank &bull; 1050735923 &bull; CONG TY TNHH NAIL
                    ATELIER
                  </div>
                  <label className="block text-[11px] font-semibold text-[#B98C68]">
                    Mã tham chiếu giao dịch / Nội dung CK:
                  </label>
                  <input
                    type="text"
                    value={transferReference}
                    onChange={(e) => setTransferReference(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFCF8] border border-[#342A2A]/15 text-xs font-mono"
                  />
                </div>
              ) : null}
            </div>

            <div className="pt-4 border-t border-[#342A2A]/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <strong>{formatVnd(displayedSubtotal)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển (Miễn phí từ 1.500.000 ₫):</span>
                <strong>{formatVnd(shippingFee)}</strong>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between text-[#3E6B52]">
                  <span>Ưu đãi ({appliedCouponCode}):</span>
                  <strong>-{formatVnd(discountAmount)}</strong>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-bold text-[#B98C68] pt-2 border-t border-[#342A2A]/10">
                <span>Tổng thanh toán:</span>
                <span>{formatVnd(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                quoteLoading ||
                !user ||
                loadingAddresses ||
                !checkoutQuote ||
                Boolean(quoteError)
              }
              className="w-full py-3.5 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
            >
              {isSubmitting
                ? "Đang tạo đơn hàng..."
                : `Xác Nhận Đặt Hàng (${formatVnd(finalTotal)})`}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
