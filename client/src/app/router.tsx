import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { PageTransition } from "../components/layout/PageTransition";
import { AccountPage } from "../features/account/AccountPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CheckoutPage } from "../features/cart/CheckoutPage";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { CollectionsPage } from "../features/catalog/CollectionsPage";
import { CustomDesignPage } from "../features/custom-design/CustomDesignPage";

import { HomePage } from "../features/home/HomePage";
import { FoundationStatusPage } from "../pages/FoundationStatusPage";
import { StudioProvider } from "./StudioContext";

export const AppRouter: React.FC = () => {
  return (
    <StudioProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          <PageTransition>
            <Routes>
              {/* 1. Trang Chủ Cinematic (Task 03) */}
              <Route path="/" element={<HomePage />} />

              {/* 2. Đặt Thiết Kế Riêng (View 3 của Demo & Task 05) */}
              <Route path="/custom-design" element={<CustomDesignPage />} />

              {/* 3. Danh Mục Sản Phẩm & Bộ Sưu Tập (Task 04) */}
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/collections" element={<CollectionsPage />} />

              {/* 4. Giỏ Hàng & Thanh Toán (Task 06) */}
              <Route path="/cart" element={<CheckoutPage />} />

              {/* 5. Khu Vực Tài Khoản Khách Hàng (Task 07) */}
              <Route path="/account/*" element={<AccountPage />} />

              {/* 6. Xác Thực Thành Viên (Task 02) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 7. Kiểm Tra Trạng Thái Nền Tảng (Task 01) */}
              <Route path="/system-status" element={<FoundationStatusPage />} />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <section className="py-20 max-w-2xl mx-auto px-4 text-center space-y-4">
                    <h1 className="font-serif-editorial text-4xl text-[#342A2A]">
                      Không tìm thấy trang yêu cầu
                    </h1>
                    <p className="text-sm text-[#342A2A]/70">
                      Đường dẫn bạn truy cập không tồn tại trong hệ thống Nail
                      Atelier.
                    </p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-3 rounded-full bg-[#342A2A] text-[#FFFCF8] text-xs font-semibold uppercase tracking-widest hover:bg-[#B98C68] transition"
                    >
                      Quay Về Trang Chủ Cinematic
                    </Link>
                  </section>
                }
              />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
      </div>
    </StudioProvider>
  );
};
