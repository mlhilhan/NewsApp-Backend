"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// .env dosyasını yükle
dotenv_1.default.config();
// JWT secret key ve options
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const JWT_OPTIONS = {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
        "24h"),
};
/**
 * JWT token oluşturma
 * @param payload - Token içinde taşınacak veriler
 * @returns JWT Token
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, JWT_OPTIONS);
};
exports.generateToken = generateToken;
/**
 * JWT token doğrulama
 * @param token - Doğrulanacak JWT token
 * @returns Doğrulanmış payload veya null
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Authorization header'dan token çıkarma
 * @param authHeader - Authorization header değeri
 * @returns Çıkarılmış token veya null
 */
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.split(" ")[1];
};
exports.extractToken = extractToken;
