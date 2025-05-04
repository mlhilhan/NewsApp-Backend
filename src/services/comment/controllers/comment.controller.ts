import { Request, Response } from "express";
import Comment from "../models/comment.model";
import User from "../../auth/models/user.model";
import News from "../../news/models/news.model";
import { ICommentQueryParams } from "../../../interfaces/comment.interface";

/**
 * Belirli bir habere ait yorumları getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getCommentsByNewsId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { newsId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
    }: ICommentQueryParams = req.query as any;

    // Sayfalama
    const offset = (Number(page) - 1) * Number(limit);

    // Yorumları getir
    const { count, rows: comments } = await Comment.findAndCountAll({
      where: { newsId },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [[sort, order]],
      limit: Number(limit),
      offset,
    });

    return res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Yorumları getirme hatası:", error);
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
 * Kullanıcının yorumlarını getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getCommentsByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
    }: ICommentQueryParams = req.query as any;

    // Sayfalama
    const offset = (Number(page) - 1) * Number(limit);

    // Yorumları getir
    const { count, rows: comments } = await Comment.findAndCountAll({
      where: { userId },
      include: [
        {
          model: News,
          attributes: ["id", "title"],
        },
      ],
      order: [[sort, order]],
      limit: Number(limit),
      offset,
    });

    return res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Yorumları getirme hatası:", error);
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
 * Yeni yorum oluştur
 * @param req - Express Request
 * @param res - Express Response
 */
export const createComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { content, newsId } = req.body;
    const userId = req.user!.id;

    // Haberin var olup olmadığını kontrol et
    const news = await News.findByPk(newsId);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Haber bulunamadı",
      });
    }

    // Yorum oluştur
    const comment = await Comment.create({
      content,
      userId,
      newsId,
    });

    // Kullanıcı bilgisi ile birlikte yorumu getir
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Yorum başarıyla oluşturuldu",
      data: createdComment,
    });
  } catch (error) {
    console.error("Yorum oluşturma hatası:", error);
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
 * Yorumu güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
export const updateComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    // Yorumu bul
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Yorum bulunamadı",
      });
    }

    // Yorum sahibi veya admin mi kontrol et
    if (comment.userId !== userId && req.user!.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bu yorumu düzenleme yetkiniz yok",
      });
    }

    // Yorumu güncelle
    await comment.update({ content });

    // Kullanıcı bilgisi ile birlikte güncellenmiş yorumu getir
    const updatedComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Yorum başarıyla güncellendi",
      data: updatedComment,
    });
  } catch (error) {
    console.error("Yorum güncelleme hatası:", error);
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
 * Yorumu sil
 * @param req - Express Request
 * @param res - Express Response
 */
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Yorumu bul
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Yorum bulunamadı",
      });
    }

    // Yorum sahibi veya admin mi kontrol et
    if (comment.userId !== userId && req.user!.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bu yorumu silme yetkiniz yok",
      });
    }

    // Yorumu sil
    await comment.destroy();

    return res.status(200).json({
      success: true,
      message: "Yorum başarıyla silindi",
    });
  } catch (error) {
    console.error("Yorum silme hatası:", error);
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
