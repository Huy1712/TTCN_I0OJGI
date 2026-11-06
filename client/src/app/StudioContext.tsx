import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatVnd } from "../config/brand";
import { useAuth } from "../features/auth/AuthProvider";
import {
  ALL_COLLECTIONS,
  HOME_PREVIEW_PRODUCTS,
  HomeCollectionPreview,
  HomeProductPreview,
} from "../features/home/homeFixtures";

export type AnimeMotionMode = "sakura-gold" | "prism-silk" | "minimal";

export interface CartItemEntry {
  product: HomeProductPreview;
  quantity: number;
  selectedShape: string;
  selectedLength: string;
}

export interface CustomDesignRecord {
  id: string;
  title: string;
  nailShape: string;
  nailLength: string;
  budget: number;
  colorStyle: string;
  notes: string;
  referenceImage: string;
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "QUOTED"
    | "ACCEPTED"
    | "IN_PRODUCTION"
    | "COMPLETED";
  quotedPrice?: number | null;
  adminResponse?: string | null;
  submittedAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: "BANK_TRANSFER" | "COD";
  paymentStatus: "PENDING" | "AWAITING_VERIFICATION" | "PAID";
  orderStatus: "PENDING_CONFIRMATION" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  subtotalAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  transferReference?: string;
  createdAt: string;
  items: {
    productId: string;
    name: string;
    image: string;
    variant: string;
    unitPrice: number;
    quantity: number;
  }[];
}

interface StudioContextValue {
  products: HomeProductPreview[];
  collections: HomeCollectionPreview[];
  animeMode: AnimeMotionMode;
  setAnimeMode: (mode: AnimeMotionMode) => void;
  figmaGuidesActive: boolean;
  toggleFigmaGuides: () => void;
  cart: CartItemEntry[];
  cartTotalQuantity: number;
  cartSubtotal: number;
  addToCart: (
    product: HomeProductPreview,
    shape?: string,
    length?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openStoryModal: (product: HomeProductPreview) => void;
  closeStoryModal: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  demoUserEmail: string | null;
  demoUserRole: "CUSTOMER" | "ADMIN";
  setDemoSession: (email: string | null, role?: "CUSTOMER" | "ADMIN") => void;
  customRequests: CustomDesignRecord[];
  addCustomRequest: (input: {
    title: string;
    budget: number;
    nailShape: string;
    nailLength: string;
    notes: string;
    colorStyle?: string;
    referenceImage?: string;
  }) => CustomDesignRecord;
  quoteCustomRequest: (
    id: string,
    quotedPrice: number,
    adminResponse: string
  ) => void;
  acceptCustomRequestQuote: (id: string) => void;
  orders: OrderRecord[];
  createOrder: (input: {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    paymentMethod: "BANK_TRANSFER" | "COD";
    discountAmount?: number;
    transferReference?: string;
  }) => OrderRecord;
  verifyOrderPayment: (orderId: string) => void;
  showToast: (message: string) => void;
}

const StudioContext = createContext<StudioContextValue | undefined>(undefined);

const INITIAL_CUSTOM_REQUESTS: CustomDesignRecord[] = [
  {
    id: "req-2026-01",
    title: "Bộ Nails Cưới Lụa Trắng & Hoa Trà Ngọc Trai",
    nailShape: "Almond",
    nailLength: "Medium",
    budget: 1350000,
    colorStyle: "Nền kem sứ trong trẻo phối ánh nhũ hồng champagne",
    notes:
      "Mình mặc váy cưới lụa satin trắng ngà, cần form móng thon gọn, đính hoa trà nổi nhẹ và ngọc trai Akoya.",
    referenceImage: "/images/product-velvet-orchid.jpg",
    status: "QUOTED",
    quotedPrice: 1350000,
    adminResponse:
      "Nail Atelier đã tiếp nhận mẫu của bạn. Nghệ nhân trưởng đề xuất nền gel sứ 5 lớp kèm ngọc trai Akoya thật, hoàn thiện trong 3 ngày làm việc.",
    submittedAt: "2026-10-25 14:30",
  },
];

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ord-2026-0001",
    orderNumber: "NA-2026-0001",
    recipientName: "Nguyễn Minh Anh",
    recipientPhone: "0909123456",
    shippingAddress: "88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PAID",
    orderStatus: "CONFIRMED",
    subtotalAmount: 890000,
    shippingFee: 30000,
    discountAmount: 0,
    totalAmount: 920000,
    transferReference: "VCB-NA20260001",
    createdAt: "2026-10-26 10:15",
    items: [
      {
        productId: "prod-1",
        name: "L’Aurore de Perle",
        image: "/images/hero-hand-petals.jpg",
        variant: "Almond • Medium",
        unitPrice: 890000,
        quantity: 1,
      },
    ],
  },
];

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [products] = useState<HomeProductPreview[]>(HOME_PREVIEW_PRODUCTS);
  const [collections] = useState<HomeCollectionPreview[]>(ALL_COLLECTIONS);
  const [animeMode, setAnimeModeState] =
    useState<AnimeMotionMode>("sakura-gold");
  const [figmaGuidesActive, setFigmaGuidesActive] = useState<boolean>(false);

  // Giỏ hàng khởi tạo sẵn 2 sản phẩm giống hệt bản demo
  const [cart, setCart] = useState<CartItemEntry[]>([
    {
      product: HOME_PREVIEW_PRODUCTS[0],
      quantity: 1,
      selectedShape: "Almond",
      selectedLength: "Medium",
    },
    {
      product: HOME_PREVIEW_PRODUCTS[1],
      quantity: 1,
      selectedShape: "Coffin",
      selectedLength: "Medium",
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [storyModalProduct, setStoryModalProduct] =
    useState<HomeProductPreview | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [demoUserEmail, setDemoUserEmail] = useState<string | null>(null);
  const [demoUserRole, setDemoUserRole] = useState<"CUSTOMER" | "ADMIN">(
    "CUSTOMER"
  );

  // Quick login form state in modal
  const [quickEmail, setQuickEmail] = useState("minhanh@nail-atelier.vn");
  const [quickPass, setQuickPass] = useState("LuxuryNail2026");

  const [customRequests, setCustomRequests] = useState<CustomDesignRecord[]>(
    INITIAL_CUSTOM_REQUESTS
  );
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  }, []);

  useEffect(() => {
    if (figmaGuidesActive) {
      document.body.classList.add("figma-spec-active");
    } else {
      document.body.classList.remove("figma-spec-active");
    }
  }, [figmaGuidesActive]);

  const setAnimeMode = useCallback(
    (mode: AnimeMotionMode) => {
      setAnimeModeState(mode);
      const labelMap: Record<AnimeMotionMode, string> = {
        "sakura-gold": "Hiệu ứng Anime: Cánh Hoa Sakura & Bụi Vàng",
        "prism-silk": "Hiệu ứng Anime: Luồng Sáng Lụa & Tinh Thể",
        minimal: "Tắt hạt chuyển động (Reduced Motion)",
      };
      showToast(`Đã chuyển chế độ chuyển động nền: ${labelMap[mode]}`);
    },
    [showToast]
  );

  const toggleFigmaGuides = useCallback(() => {
    setFigmaGuidesActive((prev) => {
      const next = !prev;
      showToast(
        next
          ? "Đã bật nhãn cấu trúc Figma Frame & AutoLayout"
          : "Đã tắt lưới Figma Spec"
      );
      return next;
    });
  }, [showToast]);

  const addToCart = useCallback(
    (
      product: HomeProductPreview,
      shape = product.shapeOptions[0] || "Almond",
      length = product.lengthOptions[0] || "Medium"
    ) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            quantity: 1,
            selectedShape: shape,
            selectedLength: length,
          },
        ];
      });
      showToast(
        `Đã thêm "${product.name}" vào giỏ hàng (${formatVnd(product.price)})`
      );
    },
    [showToast]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openStoryModal = useCallback((product: HomeProductPreview) => {
    setStoryModalProduct(product);
  }, []);
  const closeStoryModal = useCallback(() => {
    setStoryModalProduct(null);
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const setDemoSession = useCallback(
    (email: string | null, role: "CUSTOMER" | "ADMIN" = "CUSTOMER") => {
      setDemoUserEmail(email);
      setDemoUserRole(role);
    },
    []
  );

  const addCustomRequest = useCallback(
    (input: {
      title: string;
      budget: number;
      nailShape: string;
      nailLength: string;
      notes: string;
      colorStyle?: string;
      referenceImage?: string;
    }) => {
      const newRec: CustomDesignRecord = {
        id: `req-${Date.now()}`,
        title: input.title.trim() || "Bộ Nails Thiết Kế Riêng",
        budget: input.budget || 1200000,
        nailShape: input.nailShape,
        nailLength: input.nailLength,
        colorStyle:
          input.colorStyle || "Phối màu Nude Luxury & hiệu ứng ánh sáng thủ công",
        notes: input.notes,
        referenceImage: input.referenceImage || "/images/hero-hand-petals.jpg",
        status: "SUBMITTED",
        submittedAt: new Date().toLocaleString("vi-VN"),
      };
      setCustomRequests((prev) => [newRec, ...prev]);
      showToast("Đã gửi yêu cầu thiết kế riêng thành công!");
      return newRec;
    },
    [showToast]
  );

  const quoteCustomRequest = useCallback(
    (id: string, quotedPrice: number, adminResponse: string) => {
      setCustomRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? {
                ...req,
                status: "QUOTED",
                quotedPrice,
                adminResponse,
              }
            : req
        )
      );
      showToast(`Đã gửi báo giá ${formatVnd(quotedPrice)} cho yêu cầu thiết kế!`);
    },
    [showToast]
  );

  const acceptCustomRequestQuote = useCallback(
    (id: string) => {
      setCustomRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "ACCEPTED" } : req
        )
      );
      showToast(
        "Bạn đã chấp nhận báo giá! Bộ mẫu thiết kế riêng đã sẵn sàng đưa vào chế tác."
      );
    },
    [showToast]
  );

  const createOrder = useCallback(
    (input: {
      recipientName: string;
      recipientPhone: string;
      shippingAddress: string;
      paymentMethod: "BANK_TRANSFER" | "COD";
      discountAmount?: number;
      transferReference?: string;
    }) => {
      const shippingFee = cartSubtotal >= 1500000 ? 0 : 30000;
      const discount = input.discountAmount || 0;
      const totalAmount = Math.max(0, cartSubtotal + shippingFee - discount);
      const orderNumber = `NA-2026-${String(orders.length + 2).padStart(
        4,
        "0"
      )}`;

      const newOrder: OrderRecord = {
        id: `ord-${Date.now()}`,
        orderNumber,
        recipientName: input.recipientName,
        recipientPhone: input.recipientPhone,
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        paymentStatus:
          input.paymentMethod === "BANK_TRANSFER"
            ? "AWAITING_VERIFICATION"
            : "PENDING",
        orderStatus: "PENDING_CONFIRMATION",
        subtotalAmount: cartSubtotal,
        shippingFee,
        discountAmount: discount,
        totalAmount,
        transferReference: input.transferReference,
        createdAt: new Date().toLocaleString("vi-VN"),
        items: cart.map((entry) => ({
          productId: entry.product.id,
          name: entry.product.name,
          image: entry.product.image,
          variant: `${entry.selectedShape} • ${entry.selectedLength}`,
          unitPrice: entry.product.price,
          quantity: entry.quantity,
        })),
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      showToast(
        `Đặt hàng thành công! Mã đơn hàng của bạn là ${newOrder.orderNumber}`
      );
      return newOrder;
    },
    [cart, cartSubtotal, orders.length, showToast]
  );

  const verifyOrderPayment = useCallback(
    (orderId: string) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                paymentStatus: "PAID",
                orderStatus: "CONFIRMED",
              }
            : ord
        )
      );
      showToast("Đã xác nhận đối soát thanh toán & duyệt đơn hàng thành công!");
    },
    [showToast]
  );

  const handleQuickLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = quickEmail.trim().toLowerCase();
    const isAdminAccount = trimmedEmail.includes("admin");

    try {
      await login({ email: trimmedEmail, password: quickPass });
    } catch {
      // Fallback sang phiên đăng nhập trực tiếp giống bản demo nếu chưa bật backend
    }

    setDemoSession(
      trimmedEmail,
      isAdminAccount ? "ADMIN" : "CUSTOMER"
    );
    setIsAuthModalOpen(false);
    showToast(`Xin chào ${trimmedEmail}! Phiên đăng nhập đã được kích hoạt.`);
  };

  const value = useMemo<StudioContextValue>(
    () => ({
      products,
      collections,
      animeMode,
      setAnimeMode,
      figmaGuidesActive,
      toggleFigmaGuides,
      cart,
      cartTotalQuantity,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      openStoryModal,
      closeStoryModal,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      demoUserEmail: user?.email || demoUserEmail,
      demoUserRole: user?.role || demoUserRole,
      setDemoSession,
      customRequests,
      addCustomRequest,
      quoteCustomRequest,
      acceptCustomRequestQuote,
      orders,
      createOrder,
      verifyOrderPayment,
      showToast,
    }),
    [
      products,
      collections,
      animeMode,
      setAnimeMode,
      figmaGuidesActive,
      toggleFigmaGuides,
      cart,
      cartTotalQuantity,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      openStoryModal,
      closeStoryModal,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      user,
      demoUserEmail,
      demoUserRole,
      setDemoSession,
      customRequests,
      addCustomRequest,
      quoteCustomRequest,
      acceptCustomRequestQuote,
      orders,
      createOrder,
      verifyOrderPayment,
      showToast,
    ]
  );

  return (
    <StudioContext.Provider value={value}>
      {children}

      {/* PRODUCT STORY & QUICK-VIEW MODAL (GIỐNG HỆT BẢN DEMO) */}
      {storyModalProduct ? (
        <div
          id="product-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#342A2A]/70 backdrop-blur-sm p-4"
          onClick={closeStoryModal}
        >
          <div
            className="bg-[#FFFCF8] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#B98C68]/30 grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#E8D4C9]">
              <img
                src={storyModalProduct.image}
                alt={storyModalProduct.name}
                className="w-full h-full object-cover aspect-[4/5]"
              />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B98C68]">
                    {storyModalProduct.collectionName}
                  </span>
                  <button
                    type="button"
                    onClick={closeStoryModal}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#F7F1EA] hover:bg-[#E8D4C9] transition"
                  >
                    Đóng &times;
                  </button>
                </div>
                <h3 className="font-serif-editorial text-3xl text-[#342A2A] mt-1">
                  {storyModalProduct.name}
                </h3>
                <p className="text-lg font-bold text-[#B98C68] mt-1">
                  {formatVnd(storyModalProduct.price)}
                </p>
                <p className="text-xs sm:text-sm text-[#342A2A]/80 leading-relaxed mt-3">
                  {storyModalProduct.story}
                </p>
                <div className="mt-4 pt-3 border-t border-[#342A2A]/10 text-xs space-y-1.5 text-[#342A2A]/75">
                  <div>
                    <strong>Kỹ thuật:</strong> {storyModalProduct.technique}
                  </div>
                  <div>
                    <strong>Dịp phù hợp:</strong> {storyModalProduct.occasion}
                  </div>
                  <div>
                    <strong>Dáng móng hỗ trợ:</strong>{" "}
                    {storyModalProduct.shapeOptions.join(", ")}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart(storyModalProduct);
                  closeStoryModal();
                }}
                className="w-full py-3 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
              >
                Thêm Vào Giỏ Hàng
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* SLIDE-OVER CART DRAWER (GIỐNG HỆT BẢN DEMO) */}
      {isCartOpen ? (
        <div
          id="cart-drawer"
          className="fixed inset-0 z-50 flex justify-end bg-[#342A2A]/60 backdrop-blur-sm"
          onClick={closeCart}
        >
          <div
            className="bg-[#FFFCF8] w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#342A2A]/10">
                <h3 className="font-serif-editorial text-2xl text-[#342A2A]">
                  Giỏ Hàng Atelier
                </h3>
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-xs px-3 py-1 rounded-full bg-[#F7F1EA] hover:bg-[#E8D4C9]"
                >
                  Đóng &times;
                </button>
              </div>
              <div className="py-4 space-y-3 max-h-[62vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-xs text-[#342A2A]/60 py-8 text-center">
                    Giỏ hàng của bạn đang trống.
                  </p>
                ) : (
                  cart.map((entry) => (
                    <div
                      key={entry.product.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#F7F1EA] border border-[#342A2A]/10"
                    >
                      <img
                        src={entry.product.image}
                        alt={entry.product.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-serif-editorial text-lg font-semibold truncate">
                          {entry.product.name}
                        </div>
                        <div className="text-[11px] text-[#342A2A]/65">
                          {entry.selectedShape} &bull; {entry.selectedLength}
                        </div>
                        <div className="text-xs text-[#B98C68] font-semibold">
                          {formatVnd(entry.product.price)} &times;{" "}
                          {entry.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(entry.product.id, -1)
                          }
                          className="w-6 h-6 rounded-full bg-[#FFFCF8] border border-[#342A2A]/15 text-xs font-bold"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(entry.product.id, 1)
                          }
                          className="w-6 h-6 rounded-full bg-[#FFFCF8] border border-[#342A2A]/15 text-xs font-bold"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(entry.product.id)}
                          className="text-xs px-2.5 py-1 rounded-full bg-[#FFFCF8] hover:bg-[#E8B7B1]/40 text-[#342A2A] ml-1"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#342A2A]/10 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Tạm tính (Chuẩn VND):</span>
                <span className="text-base text-[#B98C68]">
                  {formatVnd(cartSubtotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate("/cart");
                }}
                className="w-full py-3 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
              >
                Tiến Hành Đặt Hàng &amp; Thanh Toán
              </button>
            </div>
          </div>
        </div>
      ) : null}

      
      {isAuthModalOpen ? (
        <div
          id="auth-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#342A2A]/65 backdrop-blur-sm p-4"
          onClick={closeAuthModal}
        >
          <div
            className="bg-[#FFFCF8] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#B98C68]/30 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B98C68]">
                Task 02 &bull; Member Access
              </span>
              <button
                type="button"
                onClick={closeAuthModal}
                className="text-xs px-2.5 py-1 rounded-full bg-[#F7F1EA]"
              >
                Đóng &times;
              </button>
            </div>
            <h3 className="font-serif-editorial text-3xl text-[#342A2A]">
              Đăng Nhập Thành Viên
            </h3>
            <form
              onSubmit={(e) => void handleQuickLoginSubmit(e)}
              className="space-y-3.5"
              noValidate
            >
              <div>
                <label
                  htmlFor="quick-email"
                  className="block text-xs font-semibold mb-1"
                >
                  Email
                </label>
                <input
                  id="quick-email"
                  type="email"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="quick-pass"
                  className="block text-xs font-semibold mb-1"
                >
                  Mật khẩu
                </label>
                <input
                  id="quick-pass"
                  type="password"
                  value={quickPass}
                  onChange={(e) => setQuickPass(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1EA] border border-[#342A2A]/15 text-sm"
                />
              </div>

              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setQuickEmail("minhanh@nail-atelier.vn");
                    setQuickPass("LuxuryNail2026");
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#F7F1EA] border border-[#B98C68]/40 text-[#342A2A] hover:bg-[#E8D4C9]"
                >
                  Điền TK Khách hàng
                </button>
              
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
              >
                Đăng Nhập
              </button>
            </form>

            <div className="pt-2 border-t border-[#342A2A]/10 flex items-center justify-between text-xs text-[#342A2A]/75">
              <Link
                to="/login"
                onClick={closeAuthModal}
                className="underline hover:text-[#B98C68]"
              >
                Mở trang Đăng nhập đầy đủ
              </Link>
              <Link
                to="/register"
                onClick={closeAuthModal}
                className="underline hover:text-[#B98C68]"
              >
                Đăng ký tài khoản mới
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* TOAST NOTIFICATION (GIỐNG HỆT BẢN DEMO) */}
      {toastMessage ? (
        <div
          id="toast-banner"
          className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl bg-[#342A2A] text-[#FFFCF8] text-xs font-medium shadow-2xl border border-[#B98C68]/40"
        >
          {toastMessage}
        </div>
      ) : null}
    </StudioContext.Provider>
  );
};

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error("useStudio phải được sử dụng bên trong <StudioProvider>");
  }
  return ctx;
}
