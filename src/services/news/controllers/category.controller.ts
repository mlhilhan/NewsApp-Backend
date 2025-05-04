import { Request, Response } from "express";
import Category from "../models/category.model";
import { ICategory } from "../../../interfaces/news.interface";

/**
 * Tüm kategorileri getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Kategorileri getirme hatası:", error);
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
 * Belirli bir kategoriyi getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

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
  } catch (error) {
    console.error("Kategori getirme hatası:", error);
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
 * Yeni kategori oluştur
 * @param req - Express Request
 * @param res - Express Response
 */
export const createCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, slug, description }: ICategory = req.body;

    // Slug kontrolü
    const existingCategory = await Category.findOne({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Bu slug zaten kullanılıyor",
      });
    }

    // Kategori oluştur
    const category = await Category.create({
      name,
      slug,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Kategori başarıyla oluşturuldu",
      data: category,
    });
  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);
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
 * Kategoriyi güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, slug, description }: ICategory = req.body;

    // Kategoriyi bul
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori bulunamadı",
      });
    }

    // Slug değiştiyse ve başka kategori tarafından kullanılıyorsa kontrol et
    if (slug && slug !== category.slug) {
      const existingSlug = await Category.findOne({ where: { slug } });
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
      description:
        description !== undefined ? description : category.description,
    });

    return res.status(200).json({
      success: true,
      message: "Kategori başarıyla güncellendi",
      data: category,
    });
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
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
 * Kategoriyi sil
 * @param req - Express Request
 * @param res - Express Response
 */
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    // Kategoriyi bul
    const category = await Category.findByPk(id);

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
  } catch (error) {
    console.error("Kategori silme hatası:", error);
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
