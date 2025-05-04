"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_preference_model_1 = __importDefault(require("../models/user-preference.model"));
const jwt_1 = require("../../../config/jwt");
/**
 * Kullanıcı Kaydı İşlemi
 * @param req - Express Request
 * @param res - Express Response
 */
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // E-posta ve kullanıcı adı kontrolü
        const existingUser = await user_model_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Bu kullanıcı adı veya e-posta zaten kullanılıyor",
            });
        }
        // Yeni kullanıcı oluştur
        const newUser = await user_model_1.default.create({
            username,
            email,
            password,
        });
        // Kullanıcı tercihleri oluştur
        await user_preference_model_1.default.create({
            userId: newUser.id,
        });
        // JWT token oluştur
        const token = (0, jwt_1.generateToken)({
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
        });
        return res.status(201).json({
            success: true,
            message: "Kullanıcı başarıyla oluşturuldu",
            data: {
                user: newUser,
                token,
            },
        });
    }
    catch (error) {
        console.error("Kayıt işlemi hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.register = register;
/**
 * Kullanıcı Girişi İşlemi
 * @param req - Express Request
 * @param res - Express Response
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Kullanıcıyı bul
        const user = await user_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz e-posta veya şifre",
            });
        }
        // Şifreyi doğrula
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz e-posta veya şifre",
            });
        }
        // JWT token oluştur
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            username: user.username,
            role: user.role,
        });
        return res.status(200).json({
            success: true,
            message: "Giriş başarılı",
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        console.error("Giriş işlemi hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.login = login;
/**
 * Kullanıcı Bilgilerini Getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getProfile = async (req, res) => {
    try {
        // req.user objesi auth middleware tarafından ekleniyor
        const user = await user_model_1.default.findByPk(req.user.id, {
            include: [user_preference_model_1.default],
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Profil getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getProfile = getProfile;
/**
 * Kullanıcı Bilgilerini Güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;
        // Kullanıcıyı bul
        const user = await user_model_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı",
            });
        }
        // E-posta değiştiyse ve başka kullanıcı tarafından kullanılıyorsa kontrol et
        if (email && email !== user.email) {
            const existingEmail = await user_model_1.default.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor",
                });
            }
        }
        // Kullanıcı adı değiştiyse ve başka kullanıcı tarafından kullanılıyorsa kontrol et
        if (username && username !== user.username) {
            const existingUsername = await user_model_1.default.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Bu kullanıcı adı başka bir kullanıcı tarafından kullanılıyor",
                });
            }
        }
        // Kullanıcıyı güncelle
        await user.update({
            username: username || user.username,
            email: email || user.email,
        });
        return res.status(200).json({
            success: true,
            message: "Profil başarıyla güncellendi",
            data: user,
        });
    }
    catch (error) {
        console.error("Profil güncelleme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.updateProfile = updateProfile;
/**
 * Kullanıcı Şifresini Değiştir
 * @param req - Express Request
 * @param res - Express Response
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        // Kullanıcıyı bul
        const user = await user_model_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı",
            });
        }
        // Mevcut şifreyi doğrula
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Mevcut şifre yanlış",
            });
        }
        // Şifreyi güncelle
        await user.update({ password: newPassword });
        return res.status(200).json({
            success: true,
            message: "Şifre başarıyla değiştirildi",
        });
    }
    catch (error) {
        console.error("Şifre değiştirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.changePassword = changePassword;
