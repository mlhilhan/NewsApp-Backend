import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenPayload } from "../interfaces/auth.interface";

// .env dosyasını yükle
dotenv.config();

// StringValue tipi tanımla
type StringValue = string | jwt.Jwt | jwt.JwtPayload | undefined;

// JWT secret key ve options
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const JWT_OPTIONS: jwt.SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES_IN ||
    "24h") as unknown as jwt.SignOptions["expiresIn"],
};

/**
 * JWT token oluşturma
 * @param payload - Token içinde taşınacak veriler
 * @returns JWT Token
 */
export const generateToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
};

/**
 * JWT token doğrulama
 * @param token - Doğrulanacak JWT token
 * @returns Doğrulanmış payload veya null
 */
export const verifyToken = (token: string): ITokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as ITokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Authorization header'dan token çıkarma
 * @param authHeader - Authorization header değeri
 * @returns Çıkarılmış token veya null
 */
export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
