import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/product.routes';
import appointmentRoutes from './routes/appointment.routes';
import customOrderRoutes from './routes/customOrder.routes';
import cartRoutes from './routes/cart.routes';

import { notFoundHandler, globalErrorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:5173', // Cho phép Frontend Vite gọi vào
    credentials: true,             // Bắt buộc bật để truyền nhận Cookie/Session
  })
);
app.use(express.json());
app.use(cookieParser());

// Cấu hình Express Session (Giải quyết triệt để lỗi req.session undefined)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nail-atelier-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Đặt là true nếu chạy trên HTTPS ở môi trường Production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Thời gian sống của session: 1 ngày
    },
  })
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/cart', cartRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;