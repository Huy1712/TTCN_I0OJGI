import React from "react";
import { useNavigate } from "react-router-dom";

export const CustomDesignCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      data-figma-tag="Section: CustomDesignCTA"
      className="figma-node py-16 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      <div className="rounded-[32px] overflow-hidden bg-[#342A2A] text-[#FFFCF8] grid grid-cols-1 lg:grid-cols-12 shadow-2xl border border-[#B98C68]/35">
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-5">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E8B7B1]">
            Atelier Bespoke Service &bull; Task 05 Flow
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl leading-tight">
            Bạn Có Ý Tưởng Hoặc Ảnh Tham Khảo Cho Bộ Nails Mơ Ước?
          </h2>
          <p className="text-sm sm:text-base text-[#E8D4C9]/90 leading-relaxed max-w-xl">
            Gửi ảnh tham khảo váy dạ hội, bó hoa cưới hoặc bảng màu yêu thích
            của bạn. Nghệ nhân trưởng của Nail Atelier sẽ tư vấn, phác thảo và
            gửi báo giá riêng trực tiếp vào tài khoản của bạn.
          </p>
          <div className="pt-2 flex flex-wrap gap-3.5">
            <button
              type="button"
              id="cta-open-custom-form"
              onClick={() => navigate("/custom-design")}
              className="px-7 py-3.5 rounded-full bg-[#E8B7B1] text-[#342A2A] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#FFFCF8] transition"
            >
              Gửi Yêu Cầu Thiết Kế Riêng Ngay
            </button>
            <button
              type="button"
              id="cta-open-figma-spec"
              onClick={() => navigate("/figma")}
              className="px-6 py-3.5 rounded-full border border-[#E8D4C9]/40 text-[#FFFCF8] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition"
            >
              Xem Kiến Trúc Figma 3D
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[300px]">
          <img
            src="/images/product-porcelain-bow.jpg"
            alt="Thiết kế móng Porcelain Blush và nơ pha lê 3D"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#342A2A] via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};
