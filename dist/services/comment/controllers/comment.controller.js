"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.getCommentsByUserId = exports.getCommentsByNewsId = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const user_model_1 = __importDefault(require("../../auth/models/user.model"));
const news_model_1 = __importDefault(require("../../news/models/news.model"));
/**
 * Belirli bir habere ait yorumları getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getCommentsByNewsId = async (req, res) => {
    try {
        const { newsId } = req.params;
        const { page = 1, limit = 10, sort = "createdAt", order = "DESC", } = req.query;
        // Sayfalama
        const offset = (Number(page) - 1) * Number(limit);
        // Yorumları getir
        const { count, rows: comments } = await comment_model_1.default.findAndCountAll({
            where: { newsId },
            include: [
                {
                    model: user_model_1.default,
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
    }
    catch (error) {
        console.error("Yorumları getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getCommentsByNewsId = getCommentsByNewsId;
/**
 * Kullanıcının yorumlarını getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getCommentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10, sort = "createdAt", order = "DESC", } = req.query;
        // Sayfalama
        const offset = (Number(page) - 1) * Number(limit);
        // Yorumları getir
        const { count, rows: comments } = await comment_model_1.default.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: news_model_1.default,
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
    }
    catch (error) {
        console.error("Yorumları getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getCommentsByUserId = getCommentsByUserId;
/**
 * Yeni yorum oluştur
 * @param req - Express Request
 * @param res - Express Response
 */
const createComment = async (req, res) => {
    try {
        const { content, newsId } = req.body;
        const userId = req.user.id;
        // Haberin var olup olmadığını kontrol et
        const news = await news_model_1.default.findByPk(newsId);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: "Haber bulunamadı",
            });
        }
        // Yorum oluştur
        const comment = await comment_model_1.default.create({
            content,
            userId,
            newsId,
        });
        // Kullanıcı bilgisi ile birlikte yorumu getir
        const createdComment = await comment_model_1.default.findByPk(comment.id, {
            include: [
                {
                    model: user_model_1.default,
                    attributes: ["id", "username"],
                },
            ],
        });
        return res.status(201).json({
            success: true,
            message: "Yorum başarıyla oluşturuldu",
            data: createdComment,
        });
    }
    catch (error) {
        console.error("Yorum oluşturma hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.createComment = createComment;
/**
 * Yorumu güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        // Yorumu bul
        const comment = await comment_model_1.default.findByPk(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Yorum bulunamadı",
            });
        }
        // Yorum sahibi veya admin mi kontrol et
        if (comment.userId !== userId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Bu yorumu düzenleme yetkiniz yok",
            });
        }
        // Yorumu güncelle
        await comment.update({ content });
        // Kullanıcı bilgisi ile birlikte güncellenmiş yorumu getir
        const updatedComment = await comment_model_1.default.findByPk(comment.id, {
            include: [
                {
                    model: user_model_1.default,
                    attributes: ["id", "username"],
                },
            ],
        });
        return res.status(200).json({
            success: true,
            message: "Yorum başarıyla güncellendi",
            data: updatedComment,
        });
    }
    catch (error) {
        console.error("Yorum güncelleme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.updateComment = updateComment;
/**
 * Yorumu sil
 * @param req - Express Request
 * @param res - Express Response
 */
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        // Yorumu bul
        const comment = await comment_model_1.default.findByPk(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Yorum bulunamadı",
            });
        }
        // Yorum sahibi veya admin mi kontrol et
        if (comment.userId !== userId && req.user.role !== "admin") {
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
    }
    catch (error) {
        console.error("Yorum silme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.deleteComment = deleteComment;
