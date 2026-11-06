/**
 * Cấu hình thương hiệu tập trung (Single Source of Truth cho Brand Identity).
 * Thay đổi tên thương hiệu, logo, slogan và thông tin cửa hàng tại đây hoặc qua biến môi trường VITE_BRAND_*
 * mà không cần chỉnh sửa từng component.
 */
export interface BrandConfig {
  name: string;
  monogram: string;
  slogan: string;
  shortManifesto: string;
  logoUrl: string | null;
  contact: {
    email: string;
    phone: string;
    address: string;
    workingHours: string;
  };
  currency: {
    code: "VND";
    locale: "vi-VN";
  };
}

export const brandConfig: BrandConfig = {
  name: import.meta.env.VITE_BRAND_NAME || "Nail Atelier",
  monogram: "NA",
  slogan:
    import.meta.env.VITE_BRAND_SLOGAN ||
    "Nghệ Thuật Điêu Khắc Ánh Sáng Trên Đầu Ngón Tay",
  shortManifesto:
    "Mỗi bộ nails thủ công tại Nail Atelier được chế tác như một tác phẩm nghệ thuật sưu tầm mang hơi thở Nude Luxury và chiều sâu điện ảnh.",
  logoUrl: import.meta.env.VITE_BRAND_LOGO_URL || null,
  contact: {
    email: import.meta.env.VITE_BRAND_EMAIL || "concierge@nail-atelier.vn",
    phone: import.meta.env.VITE_BRAND_PHONE || "028 3822 8899",
    address:
      import.meta.env.VITE_BRAND_ADDRESS ||
      "88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh",
    workingHours: "09:30 – 20:30 (Thứ Hai – Chủ Nhật)",
  },
  currency: {
    code: "VND",
    locale: "vi-VN",
  },
};

const vndFormatter = new Intl.NumberFormat(brandConfig.currency.locale, {
  style: "currency",
  currency: brandConfig.currency.code,
  maximumFractionDigits: 0,
});

/**
 * Định dạng số nguyên đồng (VND) theo chuẩn mục XVIII.8.
 */
export function formatVnd(amountInVnd: number): string {
  return vndFormatter.format(Math.round(amountInVnd));
}
