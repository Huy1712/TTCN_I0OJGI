import React from "react";
import { useNavigate } from "react-router-dom";
import { useStudio } from "../../app/StudioContext";

export const FigmaSpecPage: React.FC = () => {
  const navigate = useNavigate();
  useStudio();

  return (
    <section
      id="view-figma"
      className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-10"
    >
      <div className="bg-[#FFFCF8] rounded-3xl p-6 sm:p-10 border border-[#342A2A]/10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98C68]">
            Figma Design System &amp; Motion Specification
          </span>
         
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-5xl text-[#342A2A] mt-2 mb-3">
          Bản Thiết Kế Chi Tiết Giao Diện &amp; Cấu Trúc Lớp Chiều Sâu (Z-Depth)
        </h1>
        <p className="text-sm sm:text-base text-[#342A2A]/75 max-w-3xl">
          Giải quyết triệt để vấn đề giao diện phẳng ở Task 01: Trang chủ Task
          03 được thiết kế theo cấu trúc{" "}
          <strong>4 lớp chiều sâu không gian (Z-Axis Parallax)</strong> kết hợp
          hiệu ứng hạt chuyển động Anime trên nền HTML5 Canvas.
        </p>

        {/* Z-Axis Layer Architecture Diagram */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#342A2A] text-[#FFFCF8] border border-[#B98C68]/40">
            <div className="text-[11px] font-mono text-[#E8B7B1]">
              Z-INDEX: 0 (translateZ: -30px)
            </div>
            <div className="font-serif-editorial text-2xl mt-1 mb-2">
              Lớp 1: Studio Backdrop
            </div>
            <p className="text-xs text-[#E8D4C9]/85 leading-relaxed">
              Ảnh không gian lụa organza độ phân giải cao kết hợp lớp phủ
              gradient Nâu Than (`#342A2A`) sang Kem Nền (`#F7F1EA`) để tạo
              chiều sâu trường ảnh (DOF).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#342A2A] text-[#FFFCF8] border border-[#B98C68]/40">
            <div className="text-[11px] font-mono text-[#E8B7B1]">
              Z-INDEX: 10 (CSS Keyframes)
            </div>
            <div className="font-serif-editorial text-2xl mt-1 mb-2">
              Lớp 2: Luồng Sáng Anime
            </div>
            <p className="text-xs text-[#E8D4C9]/85 leading-relaxed">
              Các dải tia nắng chiếu xiên (`light-beam`) và quầng sáng Hồng Phấn
              (`aura-glow`) chuyển động chu kỳ 9–11 giây tạo cảm giác không khí
              điện ảnh sống động.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#342A2A] text-[#FFFCF8] border border-[#B98C68]/40">
            <div className="text-[11px] font-mono text-[#E8B7B1]">
              Z-INDEX: 20 (HTML5 Canvas 60fps)
            </div>
            <div className="font-serif-editorial text-2xl mt-1 mb-2">
              Lớp 3: Hạt Cánh Hoa &amp; Bokeh
            </div>
            <p className="text-xs text-[#E8D4C9]/85 leading-relaxed">
              38 hạt cánh hoa sakura hồng phấn xoay 3D và các hạt bụi vàng lấp
              lánh bay lơ lửng theo 3 tốc độ parallax khác nhau, tự động tắt khi
              bật `prefers-reduced-motion`.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#342A2A] text-[#FFFCF8] border border-[#B98C68]/40">
            <div className="text-[11px] font-mono text-[#E8B7B1]">
              Z-INDEX: 30 (translateZ: +52px)
            </div>
            <div className="font-serif-editorial text-2xl mt-1 mb-2">
              Lớp 4: Khung 3D Tương Tác
            </div>
            <p className="text-xs text-[#E8D4C9]/85 leading-relaxed">
              Khung ảnh sản phẩm chính nghiêng theo góc chuột (`rotateX`,
              `rotateY`) kèm các thẻ kính mờ (`backdrop-filter: blur(14px)`) nổi
              tách biệt khỏi nền.
            </p>
          </div>
        </div>

        {/* Color Tokens & Typography Spec Table */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#F7F1EA] border border-[#342A2A]/10">
            <h2 className="font-serif-editorial text-2xl text-[#342A2A] mb-4">
              Bảng Màu Nude Luxury Chuẩn Hóa
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FFFCF8] border border-black/10">
                <div className="h-10 rounded-lg bg-[#F7F1EA] border border-black/10 mb-2"></div>
                <div className="font-bold">Kem nền</div>
                <div className="font-mono text-[11px] text-[#342A2A]/60">
                  #F7F1EA
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFCF8] border border-black/10">
                <div className="h-10 rounded-lg bg-[#E8D4C9] border border-black/10 mb-2"></div>
                <div className="font-bold">Nude</div>
                <div className="font-mono text-[11px] text-[#342A2A]/60">
                  #E8D4C9
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFCF8] border border-black/10">
                <div className="h-10 rounded-lg bg-[#E8B7B1] border border-black/10 mb-2"></div>
                <div className="font-bold">Hồng phấn</div>
                <div className="font-mono text-[11px] text-[#342A2A]/60">
                  #E8B7B1
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFCF8] border border-black/10">
                <div className="h-10 rounded-lg bg-[#C78F91] border border-black/10 mb-2"></div>
                <div className="font-bold">Rose Pink</div>
                <div className="font-mono text-[11px] text-[#342A2A]/60">
                  #C78F91
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFCF8] border border-black/10">
                <div className="h-10 rounded-lg bg-[#B98C68] border border-black/10 mb-2"></div>
                <div className="font-bold">Rose Gold</div>
                <div className="font-mono text-[11px] text-[#342A2A]/60">
                  #B98C68
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFCF8] border border-black/10">
                <div className="h-10 rounded-lg bg-[#342A2A] border border-black/10 mb-2"></div>
                <div className="font-bold">Nâu than</div>
                <div className="font-mono text-[11px] text-[#342A2A]/60">
                  #342A2A
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFCF8] border border-black/10">
                <div className="h-10 rounded-lg bg-[#FFFCF8] border border-black/10 mb-2"></div>
                <div className="font-bold">Trắng ấm</div>
                <div className="font-mono text-[11px] text-[#342A2A]/60">
                  #FFFCF8
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F1EA] border border-[#342A2A]/10 flex flex-col justify-between">
            <div>
              <h2 className="font-serif-editorial text-2xl text-[#342A2A] mb-3">
                Tích Hợp Mã Nguồn Vào Dự Án Local (`localhost:5173`)
              </h2>
              <p className="text-xs sm:text-sm text-[#342A2A]/80 leading-relaxed mb-4">
                Toàn bộ giao diện trang chủ Cinematic này cùng 5 bức ảnh studio
                độ phân giải cao và đầy đủ các trang chức năng đã được tích hợp
                trực tiếp vào `client/src/` và `client/src/app/router.tsx`.
              </p>
              <ul className="text-xs space-y-2 text-[#342A2A]/85">
                <li>
                  &bull; <code>client/src/features/home/HomePage.tsx</code>:
                  Trang chủ chính thức đồng bộ 100% với bản demo.
                </li>
                <li>
                  &bull;{" "}
                  <code>
                    client/src/features/home/components/HeroCinematic.tsx
                  </code>
                  : Tích hợp Canvas hiệu ứng cánh hoa &amp; bụi vàng Anime + 3D
                  Tilt.
                </li>
                <li>
                  &bull; <code>client/public/images/*.jpg</code>: 5 ảnh nail art
                  luxury lưu trực tiếp trong thư mục tài nguyên dự án.
                </li>
              </ul>
            </div>
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                id="btn-back-to-storefront"
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-wider hover:bg-[#B98C68] transition"
              >
                Quay Lại Trải Nghiệm Trang Chủ
              </button>
              <button
                type="button"
                onClick={() => navigate("/custom-design")}
                className="px-5 py-2.5 rounded-full border border-[#B98C68] text-[#342A2A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D4C9] transition"
              >
                Sang Trang Đặt Thiết Kế Riêng
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
