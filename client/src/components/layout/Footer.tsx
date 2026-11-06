import React from "react";
import { Link } from "react-router-dom";
import { brandConfig } from "../../config/brand";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#E8D4C9] border-t border-[#342A2A]/10 py-12 px-4 sm:px-6 text-xs text-[#342A2A]/80 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-2">
            <div className="font-serif-editorial text-2xl text-[#342A2A] font-semibold uppercase tracking-widest">
              {brandConfig.name}
            </div>
            <p className="text-[#342A2A]/75 max-w-md leading-relaxed">
              {brandConfig.shortManifesto}
            </p>
            <p className="pt-1 font-medium text-[#342A2A]">
              {brandConfig.contact.address} &bull; Hotline:{" "}
              {brandConfig.contact.phone}
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#B98C68]">
              Không Gian Trải Nghiệm
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link to="/" className="hover:text-[#342A2A] transition">
                  1. Trang Chủ Cinematic
                </Link>
              </li>
              <li>
                <Link to="/figma" className="hover:text-[#342A2A] transition">
                  2. Bản Vẽ Figma &amp; 3D Depth
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-design"
                  className="hover:text-[#342A2A] transition"
                >
                  3. Đặt Thiết Kế Riêng
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-[#342A2A] transition">
                  Danh Mục Sản Phẩm (4 Bộ)
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  className="hover:text-[#342A2A] transition"
                >
                  Bộ Sưu Tập Theo Chủ Đề
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#B98C68]">
              Khách Hàng 
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link to="/cart" className="hover:text-[#342A2A] transition">
                  Giỏ Hàng &amp; Thanh Toán
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#342A2A] transition">
                  Khu Vực Tài Khoản Khách Hàng
                </Link>
              </li>
             
              <li>
                <Link to="/login" className="hover:text-[#342A2A] transition">
                  Đăng Nhập / Đăng Ký
                </Link>
              </li>
              <li>
                <Link
                  to="/system-status"
                  className="hover:text-[#342A2A] transition"
                >
                  Kiểm Tra Kết Nối Hệ Thống (Task 01)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#342A2A]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {brandConfig.name}. All rights
            reserved.
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFFCF8] text-[#342A2A] font-semibold">
              Nude Luxury &amp; Cinematic Editorial Nail Art
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
