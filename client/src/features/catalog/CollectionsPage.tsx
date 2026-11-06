import React from "react";
import { useStudio } from "../../app/StudioContext";
import { formatVnd } from "../../config/brand";

export const CollectionsPage: React.FC = () => {
  const { collections, products, openStoryModal, addToCart } = useStudio();

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B98C68]">
          Editorial Collections &bull; Bộ Sưu Tập Theo Chủ Đề
        </span>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl text-[#342A2A]">
          Câu Chuyện Ánh Sáng &amp; Chất Liệu Qua Từng Bộ Sưu Tập
        </h1>
        <p className="text-sm sm:text-base text-[#342A2A]/75">
          Mỗi bộ sưu tập tại Nail Atelier là một chương nghệ thuật riêng biệt,
          kết hợp cảm hứng thời trang cao cấp và kỹ thuật điêu khắc gel thủ
          công.
        </p>
      </div>

      <div className="space-y-14">
        {collections.map((col, index) => {
          const colProducts = products.filter(
            (p) => p.collectionSlug === col.slug
          );
          return (
            <div
              key={col.id}
              className="bg-[#FFFCF8] rounded-3xl p-6 sm:p-10 border border-[#342A2A]/10 shadow-sm space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div
                  className={`lg:col-span-6 ${
                    index % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-[#B98C68]/30">
                    <img
                      src={col.coverImage}
                      alt={col.name}
                      className="w-full aspect-[16/10] object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`lg:col-span-6 space-y-4 ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
                    Bộ Sưu Tập 0{index + 1} &bull; {col.name}
                  </span>
                  <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#342A2A]">
                    “{col.storyTitle}”
                  </h2>
                  <p className="text-sm text-[#342A2A]/80 leading-relaxed">
                    {col.description}
                  </p>
                  <p className="text-sm text-[#342A2A]/75 leading-relaxed">
                    {col.story}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#B98C68]">
                        Bảng màu:
                      </span>
                      {col.palette.map((hex) => (
                        <span
                          key={hex}
                          className="w-5 h-5 rounded-full border border-black/15"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[#342A2A]/75">
                      &bull; {col.techniqueSummary}
                    </span>
                  </div>
                </div>
              </div>

              {colProducts.length > 0 ? (
                <div className="pt-6 border-t border-[#342A2A]/10">
                  <h3 className="font-serif-editorial text-2xl text-[#342A2A] mb-4">
                    Tác Phẩm Thuộc Bộ Sưu Tập {col.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F7F1EA] border border-[#342A2A]/10"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover cursor-pointer"
                          onClick={() => openStoryModal(item)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-serif-editorial text-xl font-semibold text-[#342A2A] truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-[#B98C68] font-bold">
                            {formatVnd(item.price)}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => openStoryModal(item)}
                              className="px-2.5 py-1 rounded-full border border-[#B98C68]/50 text-[11px] font-semibold"
                            >
                              Câu chuyện
                            </button>
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                              className="px-2.5 py-1 rounded-full bg-[#342A2A] text-[#FFFCF8] text-[11px] font-semibold"
                            >
                              + Giỏ hàng
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};
