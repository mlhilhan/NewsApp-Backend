"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
/**
 * Tüm kategorileri getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await category_model_1.default.findAll();
        return res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        console.error("Kategorileri getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getAllCategories = getAllCategories;
/**
 * Belirli bir kategoriyi getir
 * @param req - Express Request
 * @param res - Express Response
 */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.default.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Kategori bulunamadı",
            });
        }
        return res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        console.error("Kategori getirme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getCategoryById = getCategoryById;
/**
 * Yeni kategori oluştur
 * @param req - Express Request
 * @param res - Express Response
 */
const createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        // Slug kontrolü
        const existingCategory = await category_model_1.default.findOne({
            where: { slug },
        });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Bu slug zaten kullanılıyor",
            });
        }
        // Kategori oluştur
        const category = await category_model_1.default.create({
            name,
            slug,
            description,
        });
        return res.status(201).json({
            success: true,
            message: "Kategori başarıyla oluşturuldu",
            data: category,
        });
    }
    catch (error) {
        console.error("Kategori oluşturma hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.createCategory = createCategory;
/**
 * Kategoriyi güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;
        // Kategoriyi bul
        const category = await category_model_1.default.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Kategori bulunamadı",
            });
        }
        // Slug değiştiyse ve başka kategori tarafından kullanılıyorsa kontrol et
        if (slug && slug !== category.slug) {
            const existingSlug = await category_model_1.default.findOne({ where: { slug } });
            if (existingSlug) {
                return res.status(400).json({
                    success: false,
                    message: "Bu slug başka bir kategori tarafından kullanılıyor",
                });
            }
        }
        // Kategoriyi güncelle
        await category.update({
            name: name || category.name,
            slug: slug || category.slug,
            description: description !== undefined ? description : category.description,
        });
        return res.status(200).json({
            success: true,
            message: "Kategori başarıyla güncellendi",
            data: category,
        });
    }
    catch (error) {
        console.error("Kategori güncelleme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.updateCategory = updateCategory;
/**
 * Kategoriyi sil
 * @param req - Express Request
 * @param res - Express Response
 */
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Kategoriyi bul
        const category = await category_model_1.default.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Kategori bulunamadı",
            });
        }
        // Kategoriyi sil
        await category.destroy();
        return res.status(200).json({
            success: true,
            message: "Kategori başarıyla silindi",
        });
    }
    catch (error) {
        console.error("Kategori silme hatası:", error);
        return res.status(500).json({
            success: false,
            message: "Sunucu hatası, lütfen daha sonra tekrar deneyin",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.deleteCategory = deleteCategory;
