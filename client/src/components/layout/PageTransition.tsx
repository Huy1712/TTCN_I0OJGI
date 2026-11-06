import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Bao bọc nội dung trang với chuyển cảnh êm, tự động cuộn lên đầu trang khi đổi route
 * và tôn trọng thiết lập prefers-reduced-motion.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition-enter">
      {children}
    </div>
  );
};
