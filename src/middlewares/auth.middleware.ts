import { Request, Response, NextFunction } from "express";
import { verifyToken, extractToken } from "../config/jwt";

/**
 * JWT Token Doğrulama Middleware
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token not found.",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or token has expired.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Server error! Please try again later.",
    });
  }
};

/**
 * Yönetici Rolü Kontrol Middleware
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Administrator privileges are required for this operation.",
    });
  }
};
