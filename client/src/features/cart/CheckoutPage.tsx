import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStudio } from "../../app/StudioContext";
import { formatVnd } from "../../config/brand";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    createOrder,
    showToast,
  } = useStudio();

  const [recipientName, setRecipientName] = useState("Nguyễn Minh Anh");
  const [recipientPhone, setRecipientPhone] = useState("0909123456");
  const [shippingAddress, setShippingAddress] = useState(
    "88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
  );
  const [paymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "COD">(
    "BANK_TRANSFER"
  );
  const [transferReference, setTransferReference] = useState("VCB-NA2026-LUX");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const shippingFee = cartSubtotal >= 1500000 || cart.length === 0 ? 0 : 30000;
  const finalTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "ATELIER10") {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(disc);
      showToast(`Đã áp dụng mã ATELIER10: Giảm ${formatVnd(disc)}`);
    } else {
      setDiscountAmount(0);
      showToast("Mã ưu đãi không hợp lệ (Gợi ý: nhập ATELIER10)");
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Giỏ hàng của bạn đang trống!");
      return;
    }
    createOrder({
      recipientName,
      recipientPhone,
      shippingAddress,
      paymentMethod,
      discountAmount,
      transferReference:
        paymentMethod === "BANK_TRANSFER" ? transferReference : undefined,
    });
    navigate("/account");
  };

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
          Task 06 &bull; Giỏ Hàng &amp; Thanh Toán Toàn Vẹn Dữ Liệu
        </span>
        <h1 className="font-serif-editorial text-3xl sm:text-5xl text-[#342A2A] mt-1">
          Giỏ Hàng &amp; Xác Nhận Đơn Hàng Atelier
        </h1>
      </div>

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
                  key={entry.product.id}
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
                        {entry.product.name}
                      </h3>
                      <p className="text-xs text-[#342A2A]/70">
                        Dáng móng: <strong>{entry.selectedShape}</strong> &bull;
                        Độ dài: <strong>{entry.selectedLength}</strong>
                      </p>
                      <p className="text-sm font-bold text-[#B98C68] mt-1">
                        {formatVnd(entry.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(entry.product.id, -1)}
                      className="w-8 h-8 rounded-full bg-[#FFFCF8] border border-[#342A2A]/15 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {entry.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(entry.product.id, 1)}
                      className="w-8 h-8 rounded-full bg-[#FFFCF8] border border-[#342A2A]/15 font-bold"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(entry.product.id)}
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
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã ưu đãi (Thử: ATELIER10)"
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-5 py-2.5 rounded-full border border-[#B98C68] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D4C9] transition"
              >
                Áp Dụng Mã
              </button>
            </div>
          </div>

          {/* Right: Shipping & Payment Form */}
          <form
            onSubmit={handleSubmitOrder}
            className="lg:col-span-5 bg-[#FFFCF8] rounded-3xl p-6 sm:p-8 border border-[#342A2A]/10 space-y-5"
          >
            <h2 className="font-serif-editorial text-2xl text-[#342A2A]">
              Thông Tin Giao Hàng &amp; Thanh Toán
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1">
                  Người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
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
                <strong>{formatVnd(cartSubtotal)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển (Miễn phí từ 1.500.000 ₫):</span>
                <strong>{formatVnd(shippingFee)}</strong>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between text-[#3E6B52]">
                  <span>Ưu đãi (ATELIER10):</span>
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
              className="w-full py-3.5 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
            >
              Xác Nhận Đặt Hàng ({formatVnd(finalTotal)})
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
