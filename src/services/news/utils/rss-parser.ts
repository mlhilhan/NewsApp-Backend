import Parser from "rss-parser";
import axios from "axios";
import cheerio from "cheerio";
import News from "../models/news.model";
import Category from "../models/category.model";
import { Op } from "sequelize";
import { rssSources } from "../config/rss-sources";

// RSS parser örneğini oluştur (daha fazla alanı destekleyecek şekilde)
const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media"],
      ["content:encoded", "contentEncoded"],
      ["description", "description"],
      ["link", "link"],
      ["guid", "guid"],
      ["pubDate", "pubDate"],
    ],
  },
});

/**
 * Tam haber içeriğini çekmek için URL'deki sayfayı ziyaret eder
 * @param url Haber URL'si
 * @param source Kaynak sitesi
 */
const fetchFullContent = async (
  url: string,
  source: string
): Promise<string | null> => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000, // 10 saniye zaman aşımı
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Kaynağa göre içerik seçicilerini ayarla (her site için özelleştirilebilir)
    let contentSelector = "";

    switch (source) {
      case "Hürriyet":
        contentSelector = ".news-content, .news-detail-text";
        break;
      case "Milliyet":
        contentSelector = ".article__content";
        break;
      case "Sözcü":
        contentSelector = ".content-text";
        break;
      case "NTV":
        contentSelector = ".category-detail-content-inner";
        break;
      case "CNN Türk":
        contentSelector = ".detail-content, .content-text";
        break;
      case "Habertürk":
        contentSelector = ".news-detail-content";
        break;
      case "Sabah":
        contentSelector = ".NewsDetailText";
        break;
      default:
        // Genel içerik seçicileri (çoğu haber sitesinde çalışır)
        contentSelector =
          "article, .article, .content, .news-content, .entry-content, .post-content";
    }

    // İçeriği çıkar
    let fullContent = "";

    if (contentSelector) {
      const contentElement = $(contentSelector);

      // Reklam, sosyal medya butonları vb. öğeleri temizle
      contentElement
        .find(
          "script, style, iframe, .social-share, .ad, .advertisement, .banner, .related-news"
        )
        .remove();

      fullContent = contentElement.text().trim();

      // Çok kısa içerik varsa, daha geniş bir seçici dene
      if (fullContent.length < 100) {
        fullContent = $("article, .article, .content, .news-content")
          .text()
          .trim();
      }
    }

    // Yine içerik bulunamadıysa, ilk p etiketlerini al
    if (!fullContent || fullContent.length < 100) {
      let paragraphs = "";
      $("p").each((i, el) => {
        // İlk 10 paragrafı al
        if (i < 10) {
          paragraphs += $(el).text().trim() + " ";
        }
      });

      if (paragraphs.length > fullContent.length) {
        fullContent = paragraphs.trim();
      }
    }

    // Satır aralarını ve fazla boşlukları temizle
    fullContent = fullContent.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();

    return fullContent;
  } catch (error) {
    console.error(`Tam içerik çekilirken hata: ${url}`, error);
    return null;
  }
};

/**
 * RSS kaynağından haber çeker ve veritabanına kaydeder
 */
export const fetchNewsFromRSS = async (): Promise<void> => {
  try {
    console.log("RSS kaynaklarından haberler çekiliyor...");
    let totalSaved = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const source of rssSources) {
      try {
        console.log(
          `${source.source} (${source.category}) kaynağından haberler çekiliyor...`
        );

        // RSS feed'ini ayrıştır
        const feed = await parser.parseURL(source.url);

        // Kategori bilgisini veritabanından al
        const category = await Category.findOne({
          where: { slug: source.category },
        });

        if (!category) {
          console.warn(
            `"${source.category}" kategorisi veritabanında bulunamadı. Haber kategoriye eklenemeyecek.`
          );
        }

        if (!feed.items || feed.items.length === 0) {
          console.log(`${source.source} kaynağından haber bulunamadı`);
          continue;
        }

        // Her haber için işlem yap
        for (const item of feed.items.slice(0, 10)) {
          // İlk 10 haber (fazla istek yapılmaması için)
          try {
            // Haber URL'si
            const url = item.link;

            // Benzersiz bir externalId oluştur
            const externalId = Buffer.from(
              item.guid || item.link || `${source.source}-${item.title}`
            )
              .toString("base64")
              .substring(0, 100);

            // Mevcut haberi kontrol et
            const existingNews = await News.findOne({
              where: {
                [Op.or]: [{ externalId }, { title: item.title?.trim() }],
              },
            });

            if (existingNews) {
              console.log(`Haber zaten mevcut: ${item.title?.trim()}`);
              totalSkipped++;
              continue;
            }

            // Başlangıç içeriğini ve resim URL'sini çıkar
            let description =
              item.contentEncoded || item.content || item.description || "";
            let imageUrl = null;

            // HTML içeriğinden metin çıkar
            const $ = cheerio.load(description);

            // Resim URL'sini bul
            if (item.media && item.media.$ && item.media.$.url) {
              imageUrl = item.media.$.url;
            } else {
              const imgTag = $("img").first();
              if (imgTag.length) {
                imageUrl = imgTag.attr("src");
              }
            }

            // HTML etiketlerini temizle
            description = description.replace(/<[^>]*>?/gm, "").trim();

            // Tam içeriği çek (haber sitesinden)
            let fullContent = description;
            if (url) {
              const detailedContent = await fetchFullContent(
                url,
                source.source
              );
              if (
                detailedContent &&
                detailedContent.length > description.length
              ) {
                fullContent = detailedContent;
              }
            }

            // Yeni haber oluştur
            const news = await News.create({
              title: item.title?.trim(),
              content: fullContent,
              description: description.substring(0, 500), // İlk 500 karakter özet olarak
              imageUrl,
              url, // Haber URL'sini kaydet
              source: source.source,
              author: item.creator || item.author || source.source,
              publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              externalId,
            });

            // Kategori ilişkisini kur
            if (category && news) {
              // Many-to-many ilişki için
              await news.$add("categories", [category]);
              console.log(
                `"${news.title}" haberi "${category.name}" kategorisine eklendi.`
              );
            }

            totalSaved++;
            console.log(`Yeni haber eklendi: ${news.title}`);
          } catch (error) {
            console.error(`Haber işlenirken hata: ${item.title}`, error);
            totalErrors++;
          }

          // API throttling - aşırı istek yapmamak için kısa bir bekleme
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        console.log(`${source.source} kaynağından haberler başarıyla çekildi.`);
      } catch (error) {
        console.error(
          `${source.source} kaynağından haber çekme hatası:`,
          error
        );
        totalErrors++;
      }
    }

    console.log(
      `İşlem tamamlandı. Toplam ${totalSaved} yeni haber kaydedildi, ${totalSkipped} haber atlandı, ${totalErrors} hata oluştu.`
    );
  } catch (error) {
    console.error("RSS haber çekme hatası:", error);
    throw error;
  }
};
