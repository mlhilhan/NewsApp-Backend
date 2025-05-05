import axios from "axios";
import News from "../models/news.model";
import Category from "../models/category.model";
import {
  IExternalNewsArticle,
  INewsApiResponse,
} from "../../../interfaces/news.interface";
import { Op } from "sequelize";

export const fetchExternalNewsJob = async (): Promise<void> => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const apiUrl = process.env.NEWS_API_URL;

    if (!apiKey || !apiUrl) {
      console.error("Haber API yapılandırması eksik");
      return;
    }

    // Tüm kategorileri getir
    const categories = await Category.findAll();
    const categoryNames = categories.map((cat) => cat.name.toLowerCase());

    // Kategori yoksa genel haberler getir
    const categoriesToFetch =
      categoryNames.length > 0 ? categoryNames : ["general"];

    // Her kategori için ayrı istek yap
    for (const category of categoriesToFetch) {
      console.log(`"${category}" kategorisi için haberler çekiliyor...`);

      // NewsAPI.org'dan haberleri çek
      const response = await axios.get(`${apiUrl}/top-headlines`, {
        params: {
          country: "tr",
          category,
          pageSize: 20,
          apiKey,
        },
      });

      const newsApiResponse: INewsApiResponse = response.data;

      if (newsApiResponse.status !== "ok") {
        console.error(
          `"${category}" kategorisi için haber alınamadı:`,
          newsApiResponse.error
        );
        continue;
      }

      // Haberleri veritabanına kaydet
      const savedCount = await Promise.all(
        (newsApiResponse.articles || []).map(
          async (article: IExternalNewsArticle) => {
            try {
              // URL'den externalId oluştur
              const externalId = article.url
                ? Buffer.from(article.url).toString("base64").substring(0, 100)
                : null;

              // Mevcut haberi kontrol et
              const existingNews = externalId
                ? await News.findOne({ where: { externalId } })
                : null;

              if (existingNews) {
                return null;
              }

              // İlgili kategoriyi bul
              const categoryObj = await Category.findOne({
                where: {
                  name: {
                    [Op.iLike]: `%${category}%`,
                  },
                },
              });

              // Yeni haber oluştur
              const news = await News.create({
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

              // Kategori ilişkisini kur (eğer kategori varsa)
              if (categoryObj && news) {
                await news.$add("categories", [categoryObj]);
              }

              return news;
            } catch (err) {
              console.error("Haber kaydedilirken hata:", err);
              return null;
            }
          }
        )
      );

      const validSavedCount = savedCount.filter(Boolean).length;
      console.log(
        `"${category}" kategorisinde ${validSavedCount} yeni haber kaydedildi`
      );
    }
  } catch (error) {
    console.error("Zamanlanmış haber çekme işleminde hata:", error);
    throw error;
  }
};
