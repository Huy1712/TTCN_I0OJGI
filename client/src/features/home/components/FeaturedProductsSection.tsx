import React, { useState } from "react";
import { useStudio } from "../../../app/StudioContext";
import { formatVnd } from "../../../config/brand";
import {
  HomeProductPreview,
  ProductCategoryFilter,
} from "../homeFixtures";

interface FeaturedProductsSectionProps {
  products: HomeProductPreview[];
}

export const FeaturedProductsSection: React.FC<
  FeaturedProductsSectionProps
> = ({ products }) => {
  const { addToCart, openStoryModal } = useStudio();
  const [activeFilter, setActiveFilter] =
    useState<ProductCategoryFilter>("ALL");

  const filteredProducts =
    activeFilter === "ALL"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const filterButtons: { id: ProductCategoryFilter; label: string }[] = [
    { id: "ALL", label: `Tất cả (${products.length})` },
    { id: "NEW", label: "Mới ra mắt" },
    { id: "BRIDAL", label: "Cưới & Dạ tiệc" },
    { id: "EDITORIAL", label: "Cinematic Editorial" },
  ];

  return (
    <section
      id="featured-section"
      data-figma-tag="Section: FeaturedProductsSection"
      className="figma-node py-20 max-w-7xl mx-auto px-4 sm:px-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68] block mb-2">
            Curated Editions &bull; Sản Phẩm Nổi Bật
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl text-[#342A2A]">
            Tuyển Tập Bộ Nails Nghệ Thuật Thủ Công
          </h2>
        </div>

        {/* Category Filter Pills (Giống hệt bản demo) */}
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Lọc bộ sưu tập"
        >
          {filterButtons.map((btn) => {
            const isCurrent = activeFilter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setActiveFilter(btn.id)}
                className={
                  isCurrent
                    ? "filter-pill px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#342A2A] text-[#FFFCF8] transition"
                    : "filter-pill px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#E8D4C9]/60 text-[#342A2A] hover:bg-[#E8D4C9] transition"
                }
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div
        id="product-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7"
      >
        {filteredProducts.map((item) => (
          <article
            key={item.id}
            className="product-card-3d bg-[#FFFCF8] rounded-[24px] overflow-hidden border border-[#342A2A]/10 flex flex-col justify-between"
          >
            <div>
              <div
                className="relative overflow-hidden aspect-[4/5] bg-[#E8D4C9] cursor-pointer"
                onClick={() => openStoryModal(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-img-zoom w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass-pill text-[11px] font-bold uppercase tracking-wider text-[#342A2A]">
                  {item.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B98C68]">
                  {item.collectionName}
                </div>
                <h3 className="font-serif-editorial text-2xl text-[#342A2A] mt-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#342A2A]/75 mt-1 line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-[#342A2A]/10">
              <span className="text-sm font-bold text-[#342A2A]">
                {formatVnd(item.price)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openStoryModal(item)}
                  className="px-3 py-1.5 rounded-full border border-[#B98C68]/50 text-[11px] font-semibold text-[#342A2A] hover:bg-[#E8D4C9]/50 transition"
                >
                  Câu chuyện
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="px-3 py-1.5 rounded-full bg-[#342A2A] text-[#FFFCF8] text-[11px] font-semibold hover:bg-[#B98C68] transition"
                >
                  + Giỏ hàng
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
