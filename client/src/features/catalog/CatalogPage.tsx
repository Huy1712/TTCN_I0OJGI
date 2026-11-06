import React, { useMemo, useState } from "react";
import { useStudio } from "../../app/StudioContext";
import { formatVnd } from "../../config/brand";
import { ProductCategoryFilter } from "../home/homeFixtures";

export const CatalogPage: React.FC = () => {
  const { products, addToCart, openStoryModal } = useStudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<ProductCategoryFilter>("ALL");
  const [selectedShape, setSelectedShape] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (category !== "ALL" && p.category !== category) return false;
        if (
          selectedShape !== "ALL" &&
          !p.shapeOptions.includes(selectedShape)
        ) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.collectionName.toLowerCase().includes(q) ||
            p.technique.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, category, selectedShape, searchQuery, sortBy]);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="bg-[#FFFCF8] rounded-3xl p-6 sm:p-10 border border-[#342A2A]/10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
              Task 04 &bull; Curated Nail Art Catalog
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl text-[#342A2A] mt-1">
              Danh Mục Bộ Nails Nghệ Thuật Thủ Công
            </h1>
          </div>

          <div className="text-xs text-[#342A2A]/70">
            Hiển thị <strong>{filtered.length}</strong> / {products.length} tác
            phẩm
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, kỹ thuật, bộ sưu tập..."
            className="px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-xs sm:text-sm focus:outline-none focus:border-[#B98C68]"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as ProductCategoryFilter)
            }
            className="px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-xs sm:text-sm focus:outline-none"
          >
            <option value="ALL">Tất cả phân loại</option>
            <option value="NEW">Mới ra mắt (New)</option>
            <option value="BRIDAL">Cưới &amp; Dạ tiệc (Bridal)</option>
            <option value="EDITORIAL">Cinematic Editorial</option>
          </select>

          <select
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-xs sm:text-sm focus:outline-none"
          >
            <option value="ALL">Mọi dáng móng (Shape)</option>
            <option value="Almond">Almond (Hạnh nhân)</option>
            <option value="Coffin">Coffin (Đầu vuông thon)</option>
            <option value="Oval">Oval (Tròn tự nhiên)</option>
            <option value="Stiletto">Stiletto (Nhọn)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as "featured" | "price-asc" | "price-desc"
              )
            }
            className="px-4 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-xs sm:text-sm focus:outline-none"
          >
            <option value="featured">Sắp xếp: Nổi bật nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {filtered.map((item) => (
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
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass-pill text-[11px] font-bold uppercase tracking-wider text-[#342A2A]">
                  {item.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B98C68]">
                  {item.collectionName}
                </div>
                <h2 className="font-serif-editorial text-2xl text-[#342A2A] mt-1">
                  {item.name}
                </h2>
                <p className="text-xs text-[#342A2A]/75 mt-1">
                  {item.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.shapeOptions.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-[#F7F1EA] text-[10px] text-[#342A2A]/75"
                    >
                      {s}
                    </span>
                  ))}
                </div>
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
