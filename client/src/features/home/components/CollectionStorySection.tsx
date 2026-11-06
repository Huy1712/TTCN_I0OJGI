import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeCollectionPreview } from "../homeFixtures";

interface CollectionStorySectionProps {
  collection: HomeCollectionPreview;
}

export const CollectionStorySection: React.FC<CollectionStorySectionProps> = ({
  collection,
}) => {
  const navigate = useNavigate();

  return (
    <section
      id="collection-section"
      data-figma-tag="Section: CollectionStorySection (Parallax Split)"
      className="figma-node py-20 bg-[#E8D4C9]/55 border-y border-[#342A2A]/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Editorial Visual Composition (Overlapping Depth Images) */}
          <div className="lg:col-span-7 relative">
            <div className="rounded-[28px] overflow-hidden shadow-2xl border border-[#FFFCF8]/60">
              <img
                src={collection.coverImage}
                alt="Bộ sưu tập Lụa & Ánh Sáng Tinh Thể"
                className="w-full aspect-[16/10] object-cover"
              />
            </div>

            {/* Overlapping Inset Detail Card */}
            <div className="hidden sm:block absolute -bottom-8 right-6 w-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFFCF8] bg-[#FFFCF8]">
              <img
                src={collection.accentImage}
                alt="Cận cảnh hoa lan 3D trong suốt và mắt mèo nhung"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-3 text-xs">
                <div className="font-bold text-[#342A2A]">
                  Chi tiết hoa lan điêu khắc 3D
                </div>
                <div className="text-[#342A2A]/70">
                  Đính ngọc trai nước ngọt &amp; nhũ từ tính
                </div>
              </div>
            </div>
          </div>

          {/* Collection Narrative */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B98C68]">
              Collection Story &bull; Chương I / 2026
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-5xl text-[#342A2A] leading-tight">
              “{collection.storyTitle}”
            </h2>
            <p className="text-sm sm:text-base text-[#342A2A]/80 leading-relaxed">
              Lấy cảm hứng từ những dải lụa organza bay trong nắng sớm và sắc
              hồng phấn của cánh hoa trà, bộ sưu tập{" "}
              <strong>L’Atelier de Lumière</strong> tái hiện hiệu ứng khúc xạ
              ánh sáng nhiều tầng ngay trên bề mặt móng.
            </p>
            <p className="text-sm sm:text-base text-[#342A2A]/80 leading-relaxed">
              {collection.story}
            </p>

            {/* Collection Selector Tabs */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FFFCF8] border border-[#B98C68]/30">
                <div className="text-[11px] uppercase tracking-wider text-[#B98C68] font-semibold">
                  Bảng màu chủ đạo
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {collection.palette.map((hex) => (
                    <span
                      key={hex}
                      className="w-5 h-5 rounded-full border border-black/15"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    ></span>
                  ))}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFCF8] border border-[#B98C68]/30">
                <div className="text-[11px] uppercase tracking-wider text-[#B98C68] font-semibold">
                  Kỹ thuật chế tác
                </div>
                <div className="text-xs font-semibold text-[#342A2A] mt-1.5">
                  {collection.techniqueSummary}
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("featured-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
              >
                Duyệt Trọn Bộ Sưu Tập
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections")}
                className="px-5 py-3 rounded-full border border-[#342A2A]/25 text-[#342A2A] text-xs font-semibold uppercase tracking-widest hover:bg-[#FFFCF8] transition"
              >
                Xem Tất Cả 3 Bộ Sưu Tập
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
