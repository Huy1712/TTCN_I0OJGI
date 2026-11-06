import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStudio } from "../../../app/StudioContext";

export const HeroCinematic: React.FC = () => {
  const navigate = useNavigate();
  const { animeMode } = useStudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const card3dRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = (canvas.width =
      canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 720);

    const particles = Array.from({ length: 38 }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: idx % 3 === 0 ? 9 + Math.random() * 7 : 2.5 + Math.random() * 4,
      speedX: 0.35 + Math.random() * 0.75,
      speedY: 0.25 + Math.random() * 0.65,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      alpha: 0.28 + Math.random() * 0.55,
      isPetal: idx % 2 === 0,
    }));

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      if (animeMode !== "minimal") {
        for (const p of particles) {
          p.x += p.speedX;
          p.y += p.speedY + Math.sin(p.angle) * 0.25;
          p.angle += p.spin;

          if (p.x > width + 24) p.x = -24;
          if (p.y > height + 24) p.y = -24;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.alpha;

          if (animeMode === "sakura-gold" && p.isPetal) {
            ctx.fillStyle = "#E8B7B1";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
              p.size,
              -p.size * 0.6,
              p.size * 1.4,
              p.size * 0.6,
              0,
              p.size * 1.2
            );
            ctx.bezierCurveTo(
              -p.size * 1.4,
              p.size * 0.6,
              -p.size,
              -p.size * 0.6,
              0,
              0
            );
            ctx.fill();
          } else {
            const grad = ctx.createRadialGradient(
              0,
              0,
              0.5,
              0,
              0,
              p.size * 1.6
            );
            grad.addColorStop(0, "rgba(255, 252, 248, 0.95)");
            grad.addColorStop(0.5, "rgba(232, 183, 177, 0.55)");
            grad.addColorStop(1, "rgba(185, 140, 104, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      animationId = window.requestAnimationFrame(drawFrame);
    };

    animationId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [animeMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (animeMode === "minimal") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    if (card3dRef.current) {
      const rotateY = relX * 12;
      const rotateX = -relY * 10;
      card3dRef.current.style.transform = `rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    }

    if (bgLayerRef.current) {
      bgLayerRef.current.style.transform = `scale(1.06) translate3d(${(
        -relX * 18
      ).toFixed(1)}px, ${(-relY * 14).toFixed(1)}px, 0)`;
    }
  };

  const handleMouseLeave = () => {
    if (card3dRef.current) {
      card3dRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero-section"
      data-figma-tag="Frame: HeroCinematic (1440x860 • 4 Parallax Layers)"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="figma-node relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-b from-[#261D1D] via-[#342A2A] to-[#F7F1EA]"
    >
      {/* Layer 0: Deep Atmospheric Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgLayerRef}
          src="/images/atelier-silk-prism.jpg"
          alt="Không gian lụa và ánh sáng Nail Atelier"
          className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-300"
          id="hero-bg-layer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#241B1B]/90 via-[#342A2A]/70 to-[#342A2A]/35"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F7F1EA] to-transparent"></div>
      </div>

      {/* Layer 1: Volumetric Anime-Inspired Sunbeams & Glowing Aura */}
      <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#E8B7B1]/25 blur-3xl aura-glow pointer-events-none z-10"></div>
      <div className="absolute top-1/4 right-10 w-[440px] h-[440px] rounded-full bg-[#B98C68]/30 blur-3xl aura-glow pointer-events-none z-10"></div>
      <div className="absolute -top-32 left-1/3 w-96 h-[140%] light-beam z-10"></div>

      {/* Layer 2: Interactive HTML5 Canvas for Anime Floating Sakura Petals & Golden Bokeh */}
      <canvas
        ref={canvasRef}
        id="anime-hero-canvas"
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      ></canvas>

      {/* Layer 3: Foreground Content & 3D Interactive Nail Art Showcase */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Story & 3 Mandatory CTAs */}
          <div
            data-figma-tag="AutoLayout: HeroCopyStack (Gap 24px)"
            className="figma-node lg:col-span-6 text-[#FFFCF8] space-y-6"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-dark text-xs tracking-[0.2em] uppercase text-[#E8B7B1]">
              <span className="w-2 h-2 rounded-full bg-[#B98C68]"></span>
              Bespoke Nail Artistry &bull; Autumn/Winter Editorial
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-[64px] leading-[1.06] font-medium tracking-tight text-[#FFFCF8]">
              Điêu Khắc{" "}
              <span className="italic font-normal text-[#E8B7B1]">
                Ánh Sáng
              </span>{" "}
              &amp; Chiều Sâu Điện Ảnh Trên Đầu Ngón Tay
            </h1>

            <p className="text-base sm:text-lg text-[#E8D4C9]/90 max-w-xl leading-relaxed font-normal">
              Mỗi bộ nails thủ công tại{" "}
              <strong className="text-[#FFFCF8] font-semibold">
                Nail Atelier
              </strong>{" "}
              được chế tác như một tác phẩm trang sức sưu tầm — kết hợp lớp sơn
              hiệu ứng mắt mèo lụa, khảm trai tự nhiên và lá vàng hồng 24K dưới
              ánh sáng studio đa tầng.
            </p>

            {/* 3 Primary Actions required by Task 03 */}
            <div
              data-figma-tag="ComponentGroup: Hero3PrimaryCTAs"
              className="figma-node pt-2 flex flex-wrap items-center gap-3.5"
            >
              <button
                type="button"
                onClick={() => scrollTo("featured-section")}
                className="px-6 py-3.5 rounded-full bg-[#E8B7B1] text-[#342A2A] text-xs sm:text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#FFFCF8] transition shadow-lg"
              >
                Khám Phá Sản Phẩm Mới
              </button>
              <button
                type="button"
                onClick={() => scrollTo("collection-section")}
                className="px-6 py-3.5 rounded-full glass-dark text-[#FFFCF8] text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] hover:bg-[#B98C68]/40 transition"
              >
                Xem Bộ Sưu Tập
              </button>
              <button
                type="button"
                id="hero-custom-design-btn"
                onClick={() => navigate("/custom-design")}
                className="px-5 py-3.5 rounded-full border border-[#B98C68] text-[#E8D4C9] text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] hover:bg-[#B98C68] hover:text-[#FFFCF8] transition"
              >
                + Đặt Mẫu Theo Yêu Cầu
              </button>
            </div>

            {/* Interactive Parallax Depth Indicator */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/15 max-w-lg text-xs text-[#E8D4C9]/85">
              <div>
                <div className="font-serif-editorial text-2xl text-[#FFFCF8]">
                  100%
                </div>
                <div>Chế tác thủ công theo form móng riêng</div>
              </div>
              <div>
                <div className="font-serif-editorial text-2xl text-[#E8B7B1]">
                  3 Lớp
                </div>
                <div>Phủ gel pha lê &amp; khảm ngọc trai thật</div>
              </div>
              <div>
                <div className="font-serif-editorial text-2xl text-[#FFFCF8]">
                  Tái sử dụng
                </div>
                <div>Độ bền sưu tầm trên 24 lần đeo</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Multi-Layer Hero Frame */}
          <div className="lg:col-span-6 perspective-stage">
            <div
              ref={card3dRef}
              id="hero-3d-card"
              data-figma-tag="3DStage: InteractiveParallaxFrame (RotateX/Y)"
              className="figma-node tilt-stage relative mx-auto max-w-xl"
            >
              {/* Back Halo Layer */}
              <div className="depth-layer-back absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-[#B98C68]/45 via-[#E8B7B1]/30 to-transparent blur-xl"></div>

              {/* Main Hero Editorial Image Card */}
              <div className="depth-layer-mid relative rounded-[28px] overflow-hidden border border-[#FFFCF8]/25 shadow-2xl bg-[#342A2A]">
                <img
                  src="/images/hero-hand-petals.jpg"
                  alt="Bộ Nails Champagne Silk & Giọt Sương Ngọc Trai 3D"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#342A2A]/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-[#FFFCF8]">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#E8B7B1] block">
                      Tác phẩm chủ đạo mùa thu
                    </span>
                    <p className="font-serif-editorial text-2xl font-medium">
                      L’Aurore de Perle — Nude Champagne Glaze
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFFCF8]/20 backdrop-blur-md text-xs font-semibold">
                    890.000&nbsp;₫
                  </span>
                </div>
              </div>

              {/* Floating Foreground Layer 1 (Top Left Glass Card) */}
              <div className="depth-layer-front float-badge hidden sm:flex items-center gap-3 glass-pill px-4 py-3 rounded-2xl shadow-xl absolute -top-6 -left-6 text-[#342A2A]">
                <img
                  src="/images/product-rose-aura.jpg"
                  alt="Chi tiết vân vàng hồng 24K"
                  className="w-12 h-12 rounded-xl object-cover border border-[#B98C68]/40"
                />
                <div className="text-xs">
                  <div className="font-bold text-[#342A2A]">
                    Vân Vàng Hồng 24K
                  </div>
                  <div className="text-[#342A2A]/70">
                    Khảm xà cừ &amp; hiệu ứng Aura
                  </div>
                </div>
              </div>

              {/* Floating Foreground Layer 2 (Bottom Right Interactive Tilt Hint) */}
              <div className="depth-layer-front float-badge-delayed hidden sm:flex items-center gap-2.5 glass-pill px-4 py-2.5 rounded-full shadow-xl absolute -bottom-5 -right-4 text-xs text-[#342A2A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B52]"></span>
                <span className="font-semibold">
                  Di chuyển chuột để cảm nhận chiều sâu 3D
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
