"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyTokenMiddleware = void 0;
const jwt_1 = require("../config/jwt");
/**
 * JWT Token Doğrulama Middleware
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
const verifyTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (0, jwt_1.extractToken)(authHeader);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization token not found.",
            });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token or token has expired.",
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Token doğrulama hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Server error! Please try again later.",
        });
    }
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
/**
 * Yönetici Rolü Kontrol Middleware
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        return res.status(403).json({
            success: false,
            message: "Administrator privileges are required for this operation.",
        });
    }
};
exports.isAdmin = isAdmin;
