"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserReactionByNewsId = exports.removeReaction = exports.addOrUpdateReaction = exports.getReactionsByNewsId = void 0;
const reaction_model_1 = __importDefault(require("../models/reaction.model"));
const news_model_1 = __importDefault(require("../../news/models/news.model"));
const comment_interface_1 = require("../../../interfaces/comment.interface");
/**
 * Belirli bir habere ait reaksiyonları getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getReactionsByNewsId = async (req, res) => {
    try {
        const { newsId } = req.params;
        // Haberin var olup olmadığını kontrol et
        const news = await news_model_1.default.findByPk(newsId);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: "Haber bulunamadı",
            });
        }
        // Reaksiyonları getir
        const reactions = await reaction_model_1.default.findAll({
            where: { newsId },
            attributes: [
                "type",
                [
                    reaction_model_1.default.sequelize.fn("COUNT", reaction_model_1.default.sequelize.col("id")),
                    "count",
                ],
            ],
            group: ["type"],
        });
        return res.status(200).json({
            success: true,
            data: reactions,
        });
    }
    catch (error) {
        console.error("Reaksiyonları getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getReactionsByNewsId = getReactionsByNewsId;
/**
 * Kullanıcının reaksiyonunu belirli bir habere ekle veya güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
const addOrUpdateReaction = async (req, res) => {
    try {
        const { newsId, type } = req.body;
        const userId = req.user.id;
        // Geçerli reaksiyon tipi mi kontrol et
        if (!Object.values(comment_interface_1.ReactionType).includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Geçersiz reaksiyon tipi",
            });
        }
        // Haberin var olup olmadığını kontrol et
        const news = await news_model_1.default.findByPk(newsId);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: "Haber bulunamadı",
            });
        }
        // Kullanıcının mevcut reaksiyonunu bul
        const existingReaction = await reaction_model_1.default.findOne({
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
            }
            else {
                // Farklı tip ise güncelle
                await existingReaction.update({ type });
                return res.status(200).json({
                    success: true,
                    message: "Reaksiyon güncellendi",
                    data: existingReaction,
                });
            }
        }
        else {
            // Yeni reaksiyon oluştur
            const reaction = await reaction_model_1.default.create({
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
    }
    catch (error) {
        console.error("Reaksiyon ekleme/güncelleme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.addOrUpdateReaction = addOrUpdateReaction;
/**
 * Kullanıcının reaksiyonunu belirli bir haberden kaldır
 * @param req - Express Request
 * @param res - Express Response
 */
const removeReaction = async (req, res) => {
    try {
        const { newsId } = req.params;
        const userId = req.user.id;
        // Reaksiyonu bul
        const reaction = await reaction_model_1.default.findOne({
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
    }
    catch (error) {
        console.error("Reaksiyon kaldırma hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.removeReaction = removeReaction;
/**
 * Belirli bir habere ait kullanıcı reaksiyonunu getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getUserReactionByNewsId = async (req, res) => {
    try {
        const { newsId } = req.params;
        const userId = req.user.id;
        // Reaksiyonu bul
        const reaction = await reaction_model_1.default.findOne({
            where: { userId, newsId },
        });
        return res.status(200).json({
            success: true,
            data: reaction || null,
        });
    }
    catch (error) {
        console.error("Kullanıcı reaksiyonu getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getUserReactionByNewsId = getUserReactionByNewsId;
