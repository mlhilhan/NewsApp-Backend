import { Request, Response } from "express";
import { Op } from "sequelize";
import User from "../models/user.model";
import UserPreference from "../models/user-preference.model";
import { generateToken } from "../../../config/jwt";
import {
  ILoginCredentials,
  IRegisterCredentials,
  IAuthResponse,
} from "../../../interfaces/auth.interface";

/**
 * Kullanıcı Kaydı İşlemi
 * @param req - Express Request
 * @param res - Express Response
 */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password }: IRegisterCredentials = req.body;

    // E-posta ve kullanıcı adı kontrolü
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu kullanıcı adı veya e-posta zaten kullanılıyor",
      });
    }

    // Yeni kullanıcı oluştur
    const newUser = await User.create({
      username,
      email,
      password,
    });

    // Kullanıcı tercihleri oluştur
    await UserPreference.create({
      userId: newUser.id,
    });

    // JWT token oluştur
    const token = generateToken({
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
  } catch (error) {
    console.error("Kayıt işlemi hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

/**
 * Kullanıcı Girişi İşlemi
 * @param req - Express Request
 * @param res - Express Response
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: ILoginCredentials = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ where: { email } });

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
    const token = generateToken({
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
  } catch (error) {
    console.error("Giriş işlemi hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

/**
 * Kullanıcı Bilgilerini Getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // req.user objesi auth middleware tarafından ekleniyor
    const user = await User.findByPk(req.user!.id, {
      include: [UserPreference],
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
  } catch (error) {
    console.error("Profil getirme hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

/**
 * Kullanıcı Bilgilerini Güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email } = req.body;
    const userId = req.user!.id;

    // Kullanıcıyı bul
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // E-posta değiştiyse ve başka kullanıcı tarafından kullanılıyorsa kontrol et
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message:
            "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor",
        });
      }
    }

    // Kullanıcı adı değiştiyse ve başka kullanıcı tarafından kullanılıyorsa kontrol et
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message:
            "Bu kullanıcı adı başka bir kullanıcı tarafından kullanılıyor",
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
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

/**
 * Kullanıcı Şifresini Değiştir
 * @param req - Express Request
 * @param res - Express Response
 */
export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    // Kullanıcıyı bul
    const user = await User.findByPk(userId);

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
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};
