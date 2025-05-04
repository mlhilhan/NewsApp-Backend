import { Request, Response } from "express";
import axios from "axios";
import News from "../models/news.model";
import Category from "../models/category.model";
import {
  INewsQueryParams,
  INewsApiResponse,
  IExternalNewsArticle,
} from "../../../interfaces/news.interface";
import { Op } from "sequelize";

/**
 * Tüm haberleri getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getAllNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      category,
      author,
      source,
      keyword,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
    }: INewsQueryParams = req.query as any;

    // Filtreleme koşulları
    const whereConditions: any = {};

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
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { content: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    // Sayfalama
    const offset = (Number(page) - 1) * Number(limit);

    // Haberleri getir
    const { count, rows: news } = await News.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Category,
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
  } catch (error) {
    console.error("Haberleri getirme hatası:", error);
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
 * Belirli bir haberi getir
 * @param req - Express Request
 * @param res - Express Response
 */
export const getNewsById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id, {
      include: [
        {
          model: Category,
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
  } catch (error) {
    console.error("Haber getirme hatası:", error);
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
 * Yeni haber oluştur
 * @param req - Express Request
 * @param res - Express Response
 */
export const createNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, content, imageUrl, source, author, category, categoryIds } =
      req.body;

    // Haber oluştur
    const news = await News.create({
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
    const createdNews = await News.findByPk(news.id, {
      include: [
        {
          model: Category,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Haber başarıyla oluşturuldu",
      data: createdNews,
    });
  } catch (error) {
    console.error("Haber oluşturma hatası:", error);
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
 * Haberi güncelle
 * @param req - Express Request
 * @param res - Express Response
 */
export const updateNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl, source, author, category, categoryIds } =
      req.body;

    // Haberi bul
    const news = await News.findByPk(id);

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
    const updatedNews = await News.findByPk(news.id, {
      include: [
        {
          model: Category,
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Haber başarıyla güncellendi",
      data: updatedNews,
    });
  } catch (error) {
    console.error("Haber güncelleme hatası:", error);
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
 * Haberi sil
 * @param req - Express Request
 * @param res - Express Response
 */
export const deleteNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    // Haberi bul
    const news = await News.findByPk(id);

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
  } catch (error) {
    console.error("Haber silme hatası:", error);
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
 * Harici haber API'sinden haberleri çek
 * @param req - Express Request
 * @param res - Express Response
 */
export const fetchExternalNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
    const response = await axios.get(`${apiUrl}/top-headlines`, {
      params: {
        country,
        category,
        pageSize,
        apiKey,
      },
    });

    const newsApiResponse: INewsApiResponse = response.data;

    if (newsApiResponse.status !== "ok") {
      return res.status(500).json({
        success: false,
        message: "Harici haber API'sinden veri alınamadı",
        error: newsApiResponse.error,
      });
    }

    // Haberleri veritabanına kaydet
    const savedNews = await Promise.all(
      (newsApiResponse.articles || []).map(
        async (article: IExternalNewsArticle) => {
          // URL'den externalId oluştur
          const externalId = article.url
            ? Buffer.from(article.url).toString("base64").substring(0, 100)
            : null;

          // Mevcut haberi kontrol et
          const existingNews = externalId
            ? await News.findOne({ where: { externalId } })
            : null;

          if (existingNews) {
            return existingNews;
          }

          // Yeni haber oluştur
          return await News.create({
            title: article.title,
            content: article.content || article.description || "",
            imageUrl: article.urlToImage || undefined,
            source: article.source?.name || undefined,
            author: article.author || undefined,
            category: category as string,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt)
              : new Date(),
            externalId: externalId || undefined,
          });
        }
      )
    );

    return res.status(200).json({
      success: true,
      message: `${savedNews.length} haber başarıyla çekildi ve kaydedildi`,
      data: savedNews,
    });
  } catch (error) {
    console.error("Harici haber çekme hatası:", error);
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
