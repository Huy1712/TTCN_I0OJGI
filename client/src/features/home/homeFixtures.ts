export type ProductCategoryFilter = "ALL" | "NEW" | "BRIDAL" | "EDITORIAL";

export interface HomeProductPreview {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  category: "NEW" | "BRIDAL" | "EDITORIAL";
  badge: string;
  storyTitle: string;
  story: string;
  technique: string;
  occasion: string;
  price: number;
  salePrice?: number | null;
  isNew: boolean;
  featured: boolean;
  collectionName: string;
  collectionSlug: string;
  image: string;
  primaryImage: string;
  shapeOptions: string[];
  lengthOptions: string[];
  colorPalette: string[];
}

export interface HomeCollectionPreview {
  id: string;
  slug: string;
  name: string;
  storyTitle: string;
  description: string;
  story: string;
  coverImage: string;
  accentImage: string;
  palette: string[];
  techniqueSummary: string;
}

export const HOME_PREVIEW_PRODUCTS: HomeProductPreview[] = [
  {
    id: "prod-1",
    slug: "l-aurore-de-perle",
    name: "L’Aurore de Perle",
    subtitle: "Nude Champagne Glaze & Ngọc Trai Sương Mai",
    shortDescription: "Nude Champagne Glaze & Ngọc Trai Sương Mai",
    category: "NEW",
    badge: "Mới ra mắt",
    storyTitle: "Giọt Sương Sớm Trên Cánh Hoa Hồng Phấn",
    story:
      "Lấy cảm hứng từ những giọt sương sớm đọng trên cánh hoa hồng phấn, bộ nails L’Aurore de Perle kết hợp lớp tráng gương ngọc trai champagne cùng kỹ thuật đính hạt pha lê giọt nước 3D thủ công.",
    technique: "Tráng gương Chrome Nude + Giọt sương Gel 3D & Ngọc trai Akoya",
    occasion: "Tiệc tối sang trọng, Chụp ảnh Editorial, Lễ đính hôn",
    price: 890000,
    isNew: true,
    featured: true,
    collectionName: "L’Atelier de Lumière",
    collectionSlug: "l-atelier-de-lumiere",
    image: "/images/hero-hand-petals.jpg",
    primaryImage: "/images/hero-hand-petals.jpg",
    shapeOptions: ["Almond", "Oval", "Coffin"],
    lengthOptions: ["Short", "Medium", "Long"],
    colorPalette: ["#F7F1EA", "#E8D4C9", "#E8B7B1", "#B98C68"],
  },
  {
    id: "prod-2",
    slug: "veine-d-or-rose",
    name: "Veine d’Or Rose 24K",
    subtitle: "Hồng Phấn Aura & Vân Vàng Hồng Khảm Xà Cừ",
    shortDescription: "Hồng Phấn Aura & Vân Vàng Hồng Khảm Xà Cừ",
    category: "EDITORIAL",
    badge: "Bán chạy",
    storyTitle: "Nghệ Thuật Kintsugi Trên Đá Travertine Ấm",
    story:
      "Sự giao thoa giữa nghệ thuật gốm Kintsugi và sắc hồng má đào trong trẻo. Từng đường vân vàng hồng 24K được vẽ tay tỉ mỉ ôm lấy các mảnh khảm xà cừ tự nhiên bắt sáng đa chiều.",
    technique: "Má hồng Aura Airbrush + Dát lá vàng hồng 24K & Khảm xà cừ thật",
    occasion: "Sự kiện thảm đỏ, Gala Dinner, Quà tặng sưu tầm",
    price: 1150000,
    isNew: false,
    featured: true,
    collectionName: "Sculpted Travertine",
    collectionSlug: "sculpted-travertine",
    image: "/images/product-rose-aura.jpg",
    primaryImage: "/images/product-rose-aura.jpg",
    shapeOptions: ["Almond", "Coffin", "Stiletto"],
    lengthOptions: ["Medium", "Long"],
    colorPalette: ["#E8B7B1", "#C78F91", "#B98C68", "#342A2A"],
  },
  {
    id: "prod-3",
    slug: "orchidee-de-velours",
    name: "Orchidée de Velours",
    subtitle: "Mắt Mèo Nhung Champagne & Hoa Lan Nổi 3D",
    shortDescription: "Mắt Mèo Nhung Champagne & Hoa Lan Nổi 3D",
    category: "BRIDAL",
    badge: "Bridal Limited",
    storyTitle: "Cánh Hoa Lan Trong Suốt Dưới Ánh Nắng Chiều",
    story:
      "Nền nhũ mắt mèo từ tính ánh rượu vang sâm panh làm nổi bật những cánh hoa lan hồ điệp được điêu khắc nổi bằng gel pha lê trong suốt, điểm xuyết ngọc trai nước ngọt.",
    technique: "Cat-Eye Velvet Magnetic + Điêu khắc hoa nổi 3D thủ công",
    occasion: "Lễ cưới, Dạ tiệc cao cấp, Kỷ niệm đặc biệt",
    price: 1290000,
    isNew: false,
    featured: true,
    collectionName: "L’Atelier de Lumière",
    collectionSlug: "l-atelier-de-lumiere",
    image: "/images/product-velvet-orchid.jpg",
    primaryImage: "/images/product-velvet-orchid.jpg",
    shapeOptions: ["Almond", "Oval", "Coffin"],
    lengthOptions: ["Medium", "Long"],
    colorPalette: ["#FFFCF8", "#E8D4C9", "#B98C68", "#342A2A"],
  },
  {
    id: "prod-4",
    slug: "ruban-de-porcelaine",
    name: "Ruban de Porcelaine",
    subtitle: "Sứ Hồng Balletcore & Đầu Móng Rose Gold Chrome",
    shortDescription: "Sứ Hồng Balletcore & Đầu Móng Rose Gold Chrome",
    category: "NEW",
    badge: "Mới ra mắt",
    storyTitle: "Dải Ruy Băng Thủy Tinh Của Vũ Công Giao Hưởng",
    story:
      "Vẻ đẹp thanh khiết của lớp nền sứ hồng trong veo kết hợp viền French tráng gương vàng hồng nóng chảy và chiếc nơ thủy tinh 3D tinh xảo.",
    technique: "Sheer Porcelain Gel + Molten Rose Gold French & Nơ pha lê 3D",
    occasion: "Hẹn hò lãng mạn, Tiệc trà chiều, Dự tiệc cưới",
    price: 950000,
    isNew: true,
    featured: true,
    collectionName: "Ballet de Soie",
    collectionSlug: "ballet-de-soie",
    image: "/images/product-porcelain-bow.jpg",
    primaryImage: "/images/product-porcelain-bow.jpg",
    shapeOptions: ["Short Oval", "Almond", "Coffin"],
    lengthOptions: ["Short", "Medium"],
    colorPalette: ["#FFFCF8", "#F7F1EA", "#E8B7B1", "#C78F91"],
  },
];

export const HOME_PREVIEW_COLLECTION: HomeCollectionPreview = {
  id: "col-1",
  slug: "l-atelier-de-lumiere",
  name: "L’Atelier de Lumière",
  storyTitle: "Khúc Khải Hoàn Của Lụa Nude & Ánh Bình Minh",
  description:
    "Lấy cảm hứng từ những dải lụa organza bay trong nắng sớm và sắc hồng phấn của cánh hoa trà, bộ sưu tập L’Atelier de Lumière tái hiện hiệu ứng khúc xạ ánh sáng nhiều tầng ngay trên bề mặt móng.",
  story:
    "Thay vì lớp màu phẳng đơn điệu, mỗi móng được phủ từ 5 đến 7 lớp gel trong suốt pha bột ngọc trai siêu mịn, tạo nên chiều sâu thị giác chuyển biến theo từng cử động bàn tay.",
  coverImage: "/images/atelier-silk-prism.jpg",
  accentImage: "/images/product-velvet-orchid.jpg",
  palette: ["#F7F1EA", "#E8D4C9", "#E8B7B1", "#C78F91", "#B98C68"],
  techniqueSummary: "Cat-Eye Velvet, Khảm Xà Cừ & Điêu Khắc Gel Nổi 3D",
};

export const ALL_COLLECTIONS: HomeCollectionPreview[] = [
  HOME_PREVIEW_COLLECTION,
  {
    id: "col-2",
    slug: "sculpted-travertine",
    name: "Sculpted Travertine",
    storyTitle: "Điêu Khắc Ánh Vàng Trên Nền Đá Kem Cổ Điển",
    description:
      "Sự giao thoa giữa kiến trúc đá Travertine, nghệ thuật gốm Kintsugi và lá vàng hồng 24K thủ công.",
    story:
      "Từng đường vân vàng hồng 24K được vẽ tay tỉ mỉ ôm lấy các mảnh khảm xà cừ tự nhiên, tôn vinh vẻ đẹp vượt thời gian cho những sự kiện thảm đỏ và dạ tiệc.",
    coverImage: "/images/product-rose-aura.jpg",
    accentImage: "/images/hero-hand-petals.jpg",
    palette: ["#E8D4C9", "#E8B7B1", "#C78F91", "#B98C68", "#342A2A"],
    techniqueSummary: "Aura Airbrush, Lá Vàng Hồng 24K & Khảm Xà Cừ Tự Nhiên",
  },
  {
    id: "col-3",
    slug: "ballet-de-soie",
    name: "Ballet de Soie",
    storyTitle: "Vũ Điệu Lụa Hồng & Pha Lê Sương Mai",
    description:
      "Vẻ đẹp thanh khiết của sứ hồng Balletcore kết hợp đường viền tráng gương vàng hồng tinh xảo.",
    story:
      "Dành riêng cho những buổi hẹn lãng mạn và lễ cưới trang nhã với phom móng thanh thoát, nhẹ nhàng như dải ruy băng lụa.",
    coverImage: "/images/product-porcelain-bow.jpg",
    accentImage: "/images/hero-hand-petals.jpg",
    palette: ["#FFFCF8", "#F7F1EA", "#E8B7B1", "#C78F91"],
    techniqueSummary: "Sheer Porcelain Gel, Molten Rose Gold French & Nơ Pha Lê",
  },
];
