import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// 1. Đăng ký tài khoản
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin.',
        data: null,
        error: 'MISSING_FIELDS',
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng.',
        data: null,
        error: 'EMAIL_ALREADY_EXISTS',
      });
      return;
    }

    const passwordHash = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone: phone ? String(phone).trim() : null,
        role: 'CUSTOMER',
      },
    });

    if (req.session) {
      (req.session as any).userId = newUser.id;
    }

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName ?? '',
          phone: newUser.phone ?? null,
          role: newUser.role,
          createdAt: newUser.createdAt.toISOString(),
          updatedAt: newUser.updatedAt.toISOString(),
        },
        csrfToken: 'mock-csrf-token',
      },
      error: null,
    });
  } catch (error: any) {
    console.error('REGISTER_ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server nội bộ.',
      data: null,
      error: error.message || 'INTERNAL_SERVER_ERROR',
    });
  }
};

// 2. Đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.',
        data: null,
        error: 'INVALID_CREDENTIALS',
      });
      return;
    }

    if (req.session) {
      (req.session as any).userId = user.id;
    }

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName ?? '',
          phone: user.phone ?? null,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        csrfToken: 'mock-csrf-token',
      },
      error: null,
    });
  } catch (error: any) {
    console.error('LOGIN_ERROR:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', data: null, error: error.message });
  }
};

// 3. Lấy thông tin user hiện tại
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null, error: 'UNAUTHORIZED' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found', data: null, error: 'USER_NOT_FOUND' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName ?? '',
          phone: user.phone ?? null,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        csrfToken: 'mock-csrf-token',
      },
      error: null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Lỗi server', data: null, error: error.message });
  }
};

// 4. Lấy CSRF Token
export const getCsrfToken = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'OK', data: { csrfToken: 'mock-csrf-token' }, error: null });
};

// 5. Đăng xuất
export const logout = async (req: Request, res: Response): Promise<void> => {
  if (req.session) req.session.destroy(() => {});
  res.clearCookie('connect.sid');
  res.status(200).json({ success: true, message: 'Logout success', data: { message: 'OK' }, error: null });
};