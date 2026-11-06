import React from "react";

export const BrandStorySection: React.FC = () => {
  return (
    <section
      id="philosophy-section"
      data-figma-tag="Section: BrandStorySection"
      className="figma-node py-20 max-w-7xl mx-auto px-4 sm:px-6"
    >
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68] block mb-2">
          Savoir-Faire &bull; Quy Trình Chế Tác
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-5xl text-[#342A2A]">
          4 Bước Chế Tác Một Bộ Nails Độc Bản
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#FFFCF8] p-6 rounded-2xl border border-[#342A2A]/10 shadow-sm hover:shadow-md transition">
          <div className="font-serif-editorial text-4xl text-[#B98C68] mb-3">
            01
          </div>
          <h3 className="font-serif-editorial text-2xl text-[#342A2A] mb-2">
            Chuẩn Hóa Form &amp; Số Đo
          </h3>
          <p className="text-sm text-[#342A2A]/75 leading-relaxed">
            Chọn dáng móng (Almond, Coffin, Oval, Stiletto) và độ dài vừa vặn
            với tỷ lệ ngón tay của riêng bạn.
          </p>
        </div>

        <div className="bg-[#FFFCF8] p-6 rounded-2xl border border-[#342A2A]/10 shadow-sm hover:shadow-md transition">
          <div className="font-serif-editorial text-4xl text-[#B98C68] mb-3">
            02
          </div>
          <h3 className="font-serif-editorial text-2xl text-[#342A2A] mb-2">
            Phối Màu Nude &amp; Ánh Sáng
          </h3>
          <p className="text-sm text-[#342A2A]/75 leading-relaxed">
            Nghệ nhân pha trộn lớp nền hồng phấn trong trẻo cùng bột tráng gương
            champagne và hiệu ứng mắt mèo đa chiều.
          </p>
        </div>

        <div className="bg-[#FFFCF8] p-6 rounded-2xl border border-[#342A2A]/10 shadow-sm hover:shadow-md transition">
          <div className="font-serif-editorial text-4xl text-[#B98C68] mb-3">
            03
          </div>
          <h3 className="font-serif-editorial text-2xl text-[#342A2A] mb-2">
            Điêu Khắc &amp; Khảm Thủ Công
          </h3>
          <p className="text-sm text-[#342A2A]/75 leading-relaxed">
            Đắp nổi từng cánh hoa gel trong suốt, dát lá vàng hồng 24K và gắn
            ngọc trai tự nhiên dưới kính phóng đại.
          </p>
        </div>

        <div className="bg-[#FFFCF8] p-6 rounded-2xl border border-[#342A2A]/10 shadow-sm hover:shadow-md transition">
          <div className="font-serif-editorial text-4xl text-[#B98C68] mb-3">
            04
          </div>
          <h3 className="font-serif-editorial text-2xl text-[#342A2A] mb-2">
            Đóng Hộp Luxury &amp; Bảo Quản
          </h3>
          <p className="text-sm text-[#342A2A]/75 leading-relaxed">
            Mỗi bộ sản phẩm đi kèm hộp trưng bày chống sốc, keo dán chuyên dụng,
            dũa pha lê và thẻ hướng dẫn bảo quản.
          </p>
        </div>
      </div>
    </section>
  );
};
