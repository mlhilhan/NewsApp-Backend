"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchExternalNews = exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsById = exports.getAllNews = void 0;
const axios_1 = __importDefault(require("axios"));
const news_model_1 = __importDefault(require("../models/news.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const sequelize_1 = require("sequelize");
/**
 * Tüm haberleri getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getAllNews = async (req, res) => {
    try {
        const { category, author, source, keyword, page = 1, limit = 10, sort = "createdAt", order = "DESC", } = req.query;
        // Filtreleme koşulları
        const whereConditions = {};
        if (category) {
            whereConditions.category = category;
        }
        if (author) {
            whereConditions.author = author;
        }
        if (source) {
            whereConditions.source = source;
        }
        if (keyword) {
            whereConditions[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.iLike]: `%${keyword}%` } },
                { content: { [sequelize_1.Op.iLike]: `%${keyword}%` } },
            ];
        }
        // Sayfalama
        const offset = (Number(page) - 1) * Number(limit);
        // Haberleri getir
        const { count, rows: news } = await news_model_1.default.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: category_model_1.default,
                    through: { attributes: [] }, // Ara tablodan alanları alma
                },
            ],
            order: [[sort, order]],
            limit: Number(limit),
            offset,
        });
        return res.status(200).json({
            success: true,
            data: news,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(count / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Haberleri getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getAllNews = getAllNews;
/**
 * Belirli bir haberi getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await news_model_1.default.findByPk(id, {
            include: [
                {
                    model: category_model_1.default,
                    through: { attributes: [] },
                },
            ],
        });
        if (!news) {
            return res.status(404).json({
                success: false,
                message: "Haber bulunamadı",
            });
        }
        return res.status(200).json({
            success: true,
            data: news,
        });
    }
    catch (error) {
        console.error("Haber getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getNewsById = getNewsById;
/**
 * Yeni haber oluştur
 * @param req - Express Request
 * @param res - Express Response
 */
const createNews = async (req, res) => {
    try {
        const { title, content, imageUrl, source, author, category, categoryIds } = req.body;
        // Haber oluştur
        const news = await news_model_1.default.create({
            title,
            content,
            imageUrl,
            source,
            author,
            category,
            publishedAt: new Date(),
        });
        // Kategorileri ekle (varsa)
        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            await news.$set("categories", categoryIds);
        }
        // Kategori ilişkileri ile birlikte haberi yeniden getir
        const createdNews = await news_model_1.default.findByPk(news.id, {
            include: [
                {
                    model: category_model_1.default,
                    through: { attributes: [] },
                },
            ],
        });
        return res.status(201).json({
            success: true,
            message: "Haber başarıyla oluşturuldu",
            data: createdNews,
        });
    }
    catch (error) {
        console.error("Haber oluşturma hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.createNews = createNews;
/**
 * Haberi güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, imageUrl, source, author, category, categoryIds } = req.body;
        // Haberi bul
        const news = await news_model_1.default.findByPk(id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: "Haber bulunamadı",
            });
        }
        // Haberi güncelle
        await news.update({
            title: title || news.title,
            content: content || news.content,
            imageUrl: imageUrl !== undefined ? imageUrl : news.imageUrl,
            source: source || news.source,
            author: author || news.author,
            category: category || news.category,
        });
        // Kategorileri güncelle (varsa)
        if (categoryIds && Array.isArray(categoryIds)) {
            await news.$set("categories", categoryIds);
        }
        // Kategori ilişkileri ile birlikte haberi yeniden getir
        const updatedNews = await news_model_1.default.findByPk(news.id, {
            include: [
                {
                    model: category_model_1.default,
                    through: { attributes: [] },
                },
            ],
        });
        return res.status(200).json({
            success: true,
            message: "Haber başarıyla güncellendi",
            data: updatedNews,
        });
    }
    catch (error) {
        console.error("Haber güncelleme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.updateNews = updateNews;
/**
 * Haberi sil
 * @param req - Express Request
 * @param res - Express Response
 */
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        // Haberi bul
        const news = await news_model_1.default.findByPk(id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: "Haber bulunamadı",
            });
        }
        // Haberi sil
        await news.destroy();
        return res.status(200).json({
            success: true,
            message: "Haber başarıyla silindi",
        });
    }
    catch (error) {
        console.error("Haber silme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.deleteNews = deleteNews;
/**
 * Harici haber API'sinden haberleri çek
 * @param req - Express Request
 * @param res - Express Response
 */
const fetchExternalNews = async (req, res) => {
    try {
        const { category = "general", country = "tr", pageSize = 10 } = req.query;
        const apiKey = process.env.NEWS_API_KEY;
        const apiUrl = process.env.NEWS_API_URL;
        if (!apiKey || !apiUrl) {
            return res.status(500).json({
                success: false,
                message: "Haber API yapılandırması eksik",
            });
        }
        // NewsAPI.org'dan haberleri çek
        const response = await axios_1.default.get(`${apiUrl}/top-headlines`, {
            params: {
                country,
                category,
                pageSize,
                apiKey,
            },
        });
        const newsApiResponse = response.data;
        if (newsApiResponse.status !== "ok") {
            return res.status(500).json({
                success: false,
                message: "Harici haber API'sinden veri alınamadı",
                error: newsApiResponse.error,
            });
        }
        // Haberleri veritabanına kaydet
        const savedNews = await Promise.all((newsApiResponse.articles || []).map(async (article) => {
            // URL'den externalId oluştur
            const externalId = article.url
                ? Buffer.from(article.url).toString("base64").substring(0, 100)
                : null;
            // Mevcut haberi kontrol et
            const existingNews = externalId
                ? await news_model_1.default.findOne({ where: { externalId } })
                : null;
            if (existingNews) {
                return existingNews;
            }
            // Yeni haber oluştur
            return await news_model_1.default.create({
                title: article.title,
                content: article.content || article.description || "",
                imageUrl: article.urlToImage || undefined,
                source: article.source?.name || undefined,
                author: article.author || undefined,
                category: category,
                publishedAt: article.publishedAt
                    ? new Date(article.publishedAt)
                    : new Date(),
                externalId: externalId || undefined,
            });
        }));
        return res.status(200).json({
            success: true,
            message: `${savedNews.length} haber başarıyla çekildi ve kaydedildi`,
            data: savedNews,
        });
    }
    catch (error) {
        console.error("Harici haber çekme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.fetchExternalNews = fetchExternalNews;
