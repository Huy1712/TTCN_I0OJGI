import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimeMotionMode, useStudio } from "../../app/StudioContext";
import { brandConfig } from "../../config/brand";
import { useAuth } from "../../features/auth/AuthProvider";

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    animeMode,
    setAnimeMode,
    cartTotalQuantity,
    openCart,
    openAuthModal,
    demoUserEmail,
    setDemoSession,
    showToast,
  } = useStudio();

  const activeEmail = user?.email || demoUserEmail;
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        await logout();
      }
    } catch {
      // Ignore if backend offline
    }
    setDemoSession(null, "CUSTOMER");
    showToast("Đã đăng xuất khỏi phiên làm việc.");
    navigate("/");
  };

  const isTabActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* TOP STUDIO SWITCHER BAR (FIGMA / MOTION / VIEW CONTROLS ) */}
      <div className="sticky top-0 z-50 bg-[#342A2A] text-[#FFFCF8] border-b border-[#B98C68]/30 px-3 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B98C68]/25 text-[#E8D4C9] font-semibold tracking-wider uppercase text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#E8B7B1] animate-ping"></span>
              Figma + Cinematic Live Studio
            </span>
            <span className="hidden xl:inline text-[#E8D4C9]/80">
              Chuyển đổi trực tiếp giữa Giao diện Điện ảnh (Task 03), Hiệu ứng nền Anime &amp; Bản vẽ Figma Spec
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* 3 Primary Studio Views from Demo + Full Pages */}
            <button
              id="tab-storefront"
              type="button"
              onClick={() => navigate("/")}
              className={`px-3 py-1 rounded-full font-medium transition ${
                isTabActive("/")
                  ? "bg-[#B98C68] text-[#FFFCF8]"
                  : "bg-white/10 hover:bg-white/20 text-[#F7F1EA]"
              }`}
            >
              1. Trang Chủ Cinematic
            </button>
            <button
              id="tab-figma"
              type="button"
              onClick={() => navigate("/figma")}
              className={`px-3 py-1 rounded-full font-medium transition ${
                isTabActive("/figma")
                  ? "bg-[#B98C68] text-[#FFFCF8]"
                  : "bg-white/10 hover:bg-white/20 text-[#F7F1EA]"
              }`}
            >
              2. Bản Vẽ Figma &amp; 3D Depth
            </button>
            <button
              id="tab-custom"
              type="button"
              onClick={() => navigate("/custom-design")}
              className={`px-3 py-1 rounded-full font-medium transition ${
                isTabActive("/custom-design")
                  ? "bg-[#B98C68] text-[#FFFCF8]"
                  : "bg-white/10 hover:bg-white/20 text-[#F7F1EA]"
              }`}
            >
              3. Đặt Thiết Kế Riêng
            </button>
            <button
              type="button"
              onClick={() => navigate("/catalog")}
              className={`px-3 py-1 rounded-full font-medium transition ${
                isTabActive("/catalog") || isTabActive("/collections")
                  ? "bg-[#B98C68] text-[#FFFCF8]"
                  : "bg-white/10 hover:bg-white/20 text-[#F7F1EA]"
              }`}
            >
              4. Danh Mục &amp; BST
            </button>
         
            <span className="h-4 w-px bg-white/20 mx-1"></span>

            {/* Anime Background Effect Switcher */}
            <label htmlFor="anime-mode-select" className="sr-only">
              Hiệu ứng nền Anime
            </label>
            <select
              id="anime-mode-select"
              value={animeMode}
              onChange={(e) =>
                setAnimeMode(e.target.value as AnimeMotionMode)
              }
              className="bg-[#241C1C] text-[#F7F1EA] border border-[#B98C68]/50 rounded-full px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="sakura-gold">
                Hiệu ứng Anime: Cánh Hoa Sakura &amp; Bụi Vàng
              </option>
              <option value="prism-silk">
                Hiệu ứng Anime: Luồng Sáng Lụa &amp; Tinh Thể
              </option>
              <option value="minimal">
                Tắt hạt chuyển động (Reduced Motion)
              </option>
            </select>

          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION HEADER (GIỐNG HỆT BẢN DEMO) */}
      <header className="sticky top-[41px] z-40 bg-[#F7F1EA]/85 backdrop-blur-md border-b border-[#342A2A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <button
            id="nav-brand-home"
            type="button"
            onClick={() => scrollToSection("hero-section")}
            className="text-left group focus:outline-none"
          >
            <div className="font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-[0.12em] uppercase text-[#342A2A] group-hover:text-[#B98C68] transition">
              {brandConfig.name}
            </div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-[#342A2A]/65">
              Nude Luxury &bull; Cinematic Editorial
            </div>
          </button>

          <nav
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#342A2A]/80"
            aria-label="Điều hướng chính"
          >
            <button
              type="button"
              onClick={() => scrollToSection("hero-section")}
              className="hover:text-[#342A2A] transition"
            >
              Trang chủ
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("featured-section")}
              className="hover:text-[#342A2A] transition"
            >
              Sản phẩm mới
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("collection-section")}
              className="hover:text-[#342A2A] transition"
            >
              Bộ sưu tập
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("philosophy-section")}
              className="hover:text-[#342A2A] transition"
            >
              Triết lý chế tác
            </button>
            <Link to="/catalog" className="hover:text-[#342A2A] transition">
              Danh mục ({4})
            </Link>
            <button
              type="button"
              id="nav-custom-cta"
              onClick={() => navigate("/custom-design")}
              className="text-[#B98C68] font-semibold hover:text-[#342A2A] transition"
            >
              Đặt mẫu theo yêu cầu
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            {activeEmail ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="px-3.5 py-2 rounded-full border border-[#B98C68]/45 text-xs font-semibold uppercase tracking-wider text-[#342A2A] hover:bg-[#E8D4C9]/60 transition"
                >
                  {activeEmail.split("@")[0]}
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="px-3 py-2 rounded-full border border-[#342A2A]/20 text-[11px] font-semibold uppercase tracking-wider text-[#342A2A]/75 hover:bg-[#E8D4C9]/50 transition"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <button
              id="btn-open-auth"
              type="button"
              onClick={() => navigate("/login")} // Thay thế openAuthModal bằng navigate("/login")
              className="px-4 py-2 rounded-full border border-[#B98C68]/45 text-xs font-semibold uppercase tracking-wider text-[#342A2A] hover:bg-[#E8D4C9]/60 transition"
            >
              <span id="auth-user-label">Đăng nhập</span>
            </button>
          )}

            <button
              id="btn-open-cart"
              type="button"
              onClick={openCart}
              className="px-4 py-2 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#B98C68] transition flex items-center gap-2"
            >
              <span>Giỏ hàng</span>
              <span
                id="cart-count-badge"
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E8B7B1] text-[#342A2A] text-[11px] font-bold"
              >
                {cartTotalQuantity}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
