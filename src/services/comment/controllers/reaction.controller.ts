import { Request, Response } from "express";
import Reaction from "../models/reaction.model";
import News from "../../news/models/news.model";
import {
  ReactionType,
  IReactionQueryParams,
} from "../../../interfaces/comment.interface";

/**
 * Belirli bir habere ait reaksiyonları getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getReactionsByNewsId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { newsId } = req.params;

    // Haberin var olup olmadığını kontrol et
    const news = await News.findByPk(newsId);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Haber bulunamadı",
      });
    }

    // Reaksiyonları getir
    const reactions = await Reaction.findAll({
      where: { newsId },
      attributes: [
        "type",
        [
          Reaction.sequelize!.fn("COUNT", Reaction.sequelize!.col("id")),
          "count",
        ],
      ],
      group: ["type"],
    });

    return res.status(200).json({
      success: true,
      data: reactions,
    });
  } catch (error) {
    console.error("Reaksiyonları getirme hatası:", error);
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
 * Kullanıcının reaksiyonunu belirli bir habere ekle veya güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
export const addOrUpdateReaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { newsId, type } = req.body;
    const userId = req.user!.id;

    // Geçerli reaksiyon tipi mi kontrol et
    if (!Object.values(ReactionType).includes(type as ReactionType)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz reaksiyon tipi",
      });
    }

    // Haberin var olup olmadığını kontrol et
    const news = await News.findByPk(newsId);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Haber bulunamadı",
      });
    }

    // Kullanıcının mevcut reaksiyonunu bul
    const existingReaction = await Reaction.findOne({
      where: { userId, newsId },
    });

    if (existingReaction) {
      // Aynı tip ise reaksiyonu kaldır
      if (existingReaction.type === type) {
        await existingReaction.destroy();
        return res.status(200).json({
          success: true,
          message: "Reaksiyon kaldırıldı",
        });
      } else {
        // Farklı tip ise güncelle
        await existingReaction.update({ type });
        return res.status(200).json({
          success: true,
          message: "Reaksiyon güncellendi",
          data: existingReaction,
        });
      }
    } else {
      // Yeni reaksiyon oluştur
      const reaction = await Reaction.create({
        userId,
        newsId,
        type,
      });

      return res.status(201).json({
        success: true,
        message: "Reaksiyon eklendi",
        data: reaction,
      });
    }
  } catch (error) {
    console.error("Reaksiyon ekleme/güncelleme hatası:", error);
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
 * Kullanıcının reaksiyonunu belirli bir haberden kaldır
 * @param req - Express Request
 * @param res - Express Response
 */
export const removeReaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { newsId } = req.params;
    const userId = req.user!.id;

    // Reaksiyonu bul
    const reaction = await Reaction.findOne({
      where: { userId, newsId },
    });

    if (!reaction) {
      return res.status(404).json({
        success: false,
        message: "Reaksiyon bulunamadı",
      });
    }

    // Reaksiyonu sil
    await reaction.destroy();

    return res.status(200).json({
      success: true,
      message: "Reaksiyon başarıyla kaldırıldı",
    });
  } catch (error) {
    console.error("Reaksiyon kaldırma hatası:", error);
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
 * Belirli bir habere ait kullanıcı reaksiyonunu getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getUserReactionByNewsId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { newsId } = req.params;
    const userId = req.user!.id;

    // Reaksiyonu bul
    const reaction = await Reaction.findOne({
      where: { userId, newsId },
    });

    return res.status(200).json({
      success: true,
      data: reaction || null,
    });
  } catch (error) {
    console.error("Kullanıcı reaksiyonu getirme hatası:", error);
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
