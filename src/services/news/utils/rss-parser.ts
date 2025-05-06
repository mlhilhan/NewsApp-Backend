import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import News from "../models/news.model";
import Category from "../models/category.model";
import { Op } from "sequelize";
import { rssSources } from "../config/rss-sources";
import { downloadImage } from "./image-downloader";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media"],
      ["content:encoded", "contentEncoded"],
      ["description", "description"],
      ["link", "link"],
      ["guid", "guid"],
      ["pubDate", "pubDate"],
      ["enclosure", "enclosure"],
      ["og:image", "ogImage"],
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
    // Farklı haber siteleri için HTTP isteklerinde daha uzun timeout kullanın
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9",
        "Accept-Charset": "utf-8",
      },
      responseType: "arraybuffer",
      timeout: 15000,
    });

    // HTML içeriğini doğru şekilde çözümleyin
    const html = new TextDecoder("utf-8").decode(response.data);
    const $ = cheerio.load(html, { decodeEntities: false });

    // Kaynak bazlı özel seçicileri güncelleyin
    let fullContent = "";

    switch (source) {
      case "Habertürk":
        // HTML'den içerik çıkarma
        const htContentNodes = $(
          ".news-detail-content, .news-content, .haber-detay .content"
        ).first();
        if (htContentNodes.length > 0) {
          // Temizleme: reklam, sosyal medya vs kaldırma
          htContentNodes
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = htContentNodes.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }

        // Alternatif: p etiketleriyle deneme
        let htParagraphs = "";
        $(".news-detail-content p, .content p, article p").each((i, el) => {
          const text = $(el).text().trim();
          if (text.length > 20) {
            // Kısa içerikli paragrafları atla
            htParagraphs += text + " ";
          }
        });
        if (htParagraphs.length > 150) return htParagraphs.trim();
        break;

      case "CNN Türk":
        const cnnContentNodes = $(
          ".detail-news-content, .content-text, .news-detail__body, .detail-content"
        ).first();
        if (cnnContentNodes.length > 0) {
          cnnContentNodes
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = cnnContentNodes.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }

        let cnnParagraphs = "";
        $(".detail-news-content p, .content-text p, .news-detail__body p").each(
          (i, el) => {
            const text = $(el).text().trim();
            if (text.length > 20) {
              cnnParagraphs += text + " ";
            }
          }
        );
        if (cnnParagraphs.length > 150) return cnnParagraphs.trim();
        break;

      case "Sözcü":
        const sozcuContent = $(
          ".content-text, .news-detail__content, .article-content"
        ).first();
        if (sozcuContent.length > 0) {
          sozcuContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = sozcuContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Hürriyet":
        const hurriyetContent = $(
          ".news-content, .news-detail-text, .article-content"
        ).first();
        if (hurriyetContent.length > 0) {
          hurriyetContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = hurriyetContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Milliyet":
        const milliyetContent = $(
          ".article__content, .article-body, .news-content"
        ).first();
        if (milliyetContent.length > 0) {
          milliyetContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = milliyetContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "NTV":
        const ntvContent = $(
          ".category-detail-content-inner, .news-detail-content, .article-body"
        ).first();
        if (ntvContent.length > 0) {
          ntvContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = ntvContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Sabah":
        const sabahContent = $(
          ".NewsDetailText, .article-content, .content"
        ).first();
        if (sabahContent.length > 0) {
          sabahContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = sabahContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Cumhuriyet":
        const cumhuriyetContent = $(
          ".news-content, .detail-content, .article-content"
        ).first();
        if (cumhuriyetContent.length > 0) {
          cumhuriyetContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = cumhuriyetContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "TRT Haber":
        const trtContent = $(
          ".detail-content, .article-body, .news-text"
        ).first();
        if (trtContent.length > 0) {
          trtContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = trtContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Webtekno":
        const webteknoContent = $(
          ".content, .post-content, .article-content"
        ).first();
        if (webteknoContent.length > 0) {
          webteknoContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = webteknoContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "ShiftDelete":
        const shiftDeleteContent = $(
          ".entry-content, .post-content, .article-content"
        ).first();
        if (shiftDeleteContent.length > 0) {
          shiftDeleteContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = shiftDeleteContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Technopat":
        const technopatContent = $(
          ".entry-content, .post-content, .article-content"
        ).first();
        if (technopatContent.length > 0) {
          technopatContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = technopatContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Bloomberg HT":
        const bloombergContent = $(
          ".news-content, .article-body, .content-text"
        ).first();
        if (bloombergContent.length > 0) {
          bloombergContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = bloombergContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Fanatik":
        const fanatikContent = $(
          ".news-detail, .article-content, .content-text"
        ).first();
        if (fanatikContent.length > 0) {
          fanatikContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = fanatikContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;

      case "Sporx":
        const sporxContent = $(
          ".news-content, .detail-content, .article-content"
        ).first();
        if (sporxContent.length > 0) {
          sporxContent
            .find("script, style, iframe, .social-share, .ads, .banner")
            .remove();
          fullContent = sporxContent.text().replace(/\s+/g, " ").trim();
          if (fullContent.length > 150) return fullContent;
        }
        break;
    }

    // Genel içerik çıkarma yöntemi (özel işleyici başarısız olursa veya kaynağa özel işleyici yoksa)
    if (!fullContent || fullContent.length <= 150) {
      console.log(
        `Kaynak özel işleyicisi başarısız oldu veya bulunamadı, genel yöntemler deneniyor: ${source}`
      );

      // Genel içerik seçicileri
      const contentSelectors = [
        "article .content",
        ".news-detail",
        ".news-content",
        ".article__content",
        ".content-text",
        ".detail-content",
        ".news-detail-content",
        ".detail-news-content",
        "article p",
        ".entry-content",
        ".post-content",
        ".article-content",
        ".news-text",
        ".detail-text",
        ".article-body",
        ".detail",
        ".content",
      ];

      // Her seçiciyi deneyin
      for (const selector of contentSelectors) {
        const contentElement = $(selector).first();
        if (contentElement.length > 0) {
          contentElement
            .find(
              "script, style, iframe, .social-share, .ads, .banner, .related-news"
            )
            .remove();
          const content = contentElement.text().replace(/\s+/g, " ").trim();
          if (content && content.length > 150) {
            console.log(
              `Genel seçici başarılı: ${selector}, içerik uzunluğu: ${content.length}`
            );
            return content;
          }
        }
      }

      // Son çare: Tüm p etiketlerini toplama
      console.log("Son çare: Tüm p etiketleri toplanıyor");
      let allParagraphs = "";
      $("p").each((i, el) => {
        // İlk 15 paragrafı al (çok uzun olmasın)
        if (i < 15) {
          const text = $(el).text().trim();
          if (text.length > 30) {
            allParagraphs += text + " ";
          }
        }
      });

      if (allParagraphs.length > 150) {
        console.log(
          `P etiketlerinden toplanan içerik uzunluğu: ${allParagraphs.length}`
        );
        return allParagraphs.trim();
      }
    }

    // Eğer buraya kadar geldiyse ve hala içerik bulunamadıysa
    if (!fullContent || fullContent.length <= 150) {
      console.warn(`${url} için içerik çekilemedi.`);
      return null;
    }

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
        let feed;
        try {
          feed = await parser.parseURL(source.url);
        } catch (rssError) {
          console.error(`RSS ayrıştırma hatası (${source.url}):`, rssError);
          totalErrors++;
          continue; // Bu kaynağı atla ve sonrakine geç
        }

        // Kategori bilgisini veritabanından al
        const category = await Category.findOne({
          where: { slug: source.category },
        });

        if (!category) {
          console.warn(
            `"${source.category}" kategorisi veritabanında bulunamadı. Kategori eşleştirme algoritması denenecek.`
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

            // URL kontrolü
            if (!url) {
              console.warn(`Geçersiz URL: ${item.title}`);
              totalSkipped++;
              continue;
            }

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
            const $ = cheerio.load(description || "", {
              decodeEntities: false,
            });

            // Resim URL'sini bul
            if (item.media && item.media.$ && item.media.$.url) {
              imageUrl = item.media.$.url;
            } else if (item.enclosure && item.enclosure.url) {
              imageUrl = item.enclosure.url;
            } else if (description) {
              const imgTag = $("img").first();
              if (imgTag.length) {
                imageUrl = imgTag.attr("src");
              }
            }

            // HTML etiketlerini temizle
            description = description.replace(/<[^>]*>?/gm, "").trim();

            // Tam içeriği çek (haber sitesinden)
            let fullContent = description;
            let contentFetched = false;

            if (url) {
              try {
                console.log(`İçerik çekiliyor: ${url}`);
                const detailedContent = await fetchFullContent(
                  url,
                  source.source
                );

                if (
                  detailedContent &&
                  detailedContent.length > description.length + 100
                ) {
                  fullContent = detailedContent;
                  contentFetched = true;
                  console.log(
                    `İçerik başarıyla çekildi: ${url} (${fullContent.length} karakter)`
                  );
                } else {
                  console.warn(`İçerik çekilemedi veya çok kısa: ${url}`);
                }
              } catch (contentError) {
                console.error(`İçerik çekme hatası: ${url}`, contentError);
              }
            }

            // Kategori eşleştirme işlemi
            let categoryIds: number[] = [];

            try {
              // 1. Doğrudan kategori varsa kullan
              if (category) {
                categoryIds = [category.id];
              } else {
                // 2. Mevcut kategorilerden eşleştirme yap
                const allCategories = await Category.findAll();

                // Kaynak kategorisine göre eşleştirme
                const sourceSlug = source.category.toLowerCase();

                // a. Doğrudan slug eşleştirmesi
                const exactMatch = allCategories.find(
                  (cat) => cat.slug === sourceSlug
                );

                if (exactMatch) {
                  categoryIds = [exactMatch.id];
                } else {
                  // b. Benzer slug veya isim eşleştirmesi
                  const similarMatches = allCategories.filter(
                    (cat) =>
                      cat.slug.includes(sourceSlug) ||
                      sourceSlug.includes(cat.slug) ||
                      cat.name.toLowerCase().includes(sourceSlug) ||
                      sourceSlug.includes(cat.name.toLowerCase())
                  );

                  if (similarMatches.length > 0) {
                    categoryIds = similarMatches.map((cat) => cat.id);
                  } else {
                    // c. URL'den kategori tahmini
                    if (url) {
                      const urlParts = url.toLowerCase().split("/");
                      const possibleCategories = urlParts.filter(
                        (part) =>
                          !part.includes("http") &&
                          !part.includes("www") &&
                          part.length > 3
                      );

                      for (const part of possibleCategories) {
                        const urlMatch = allCategories.find(
                          (cat) =>
                            cat.slug.includes(part) ||
                            part.includes(cat.slug) ||
                            cat.name.toLowerCase().includes(part) ||
                            part.includes(cat.name.toLowerCase())
                        );

                        if (urlMatch) {
                          categoryIds.push(urlMatch.id);
                          break;
                        }
                      }
                    }

                    // d. İçerik türüne göre varsayılan kategori ata
                    if (categoryIds.length === 0) {
                      // Varsayılan kategori ataması
                      const defaultCategories: Record<string, string[]> = {
                        "breaking-news": [
                          "breaking-news",
                          "agenda",
                          "son-dakika",
                        ],
                        agenda: ["agenda", "gündem"],
                        world: ["world", "dunya", "dünya"],
                        politics: ["politics", "siyaset", "politika"],
                        economy: ["economy", "ekonomi"],
                        business: ["business", "is-dunyasi", "iş-dünyası"],
                        technology: ["technology", "teknoloji"],
                        science: ["science", "bilim"],
                        health: ["health", "sağlık", "saglik"],
                        education: ["education", "eğitim", "egitim"],
                        sports: ["sports", "spor"],
                        football: ["football", "futbol"],
                        basketball: ["basketball", "basketbol"],
                        entertainment: ["entertainment", "magazin"],
                        "culture-art": [
                          "culture-art",
                          "kültür-sanat",
                          "kultur-sanat",
                        ],
                        lifestyle: ["lifestyle", "yaşam", "yasam"],
                        travel: ["travel", "seyahat", "gezi"],
                        automotive: ["automotive", "otomobil", "araba"],
                        "real-estate": ["real-estate", "emlak"],
                        environment: ["environment", "çevre", "cevre"],
                        local: ["local", "yerel"],
                      };

                      // İlgili kategorileri bul
                      const possibleSlugs = defaultCategories[sourceSlug] || [
                        sourceSlug,
                      ];

                      for (const slug of possibleSlugs) {
                        const defaultCategory = allCategories.find(
                          (cat) =>
                            cat.slug === slug ||
                            cat.slug.includes(slug) ||
                            slug.includes(cat.slug)
                        );

                        if (defaultCategory) {
                          categoryIds = [defaultCategory.id];
                          break;
                        }
                      }

                      // Hala kategori bulunamadıysa, ilk kategoriyi kullan
                      if (
                        categoryIds.length === 0 &&
                        allCategories.length > 0
                      ) {
                        const firstCategory =
                          allCategories.find((cat) => cat.slug === "agenda") ||
                          allCategories[0];
                        categoryIds = [firstCategory.id];
                      }
                    }
                  }
                }
              }

              console.log(
                `"${item.title}" için eşleştirilen kategoriler:`,
                categoryIds
              );
            } catch (categoryError) {
              console.error("Kategori eşleştirme hatası:", categoryError);
              // Hata olursa en azından varsayılan kategoriyi atamaya çalış
              try {
                const defaultCategory = await Category.findOne({
                  where: { slug: "agenda" },
                });
                if (defaultCategory) {
                  categoryIds = [defaultCategory.id];
                }
              } catch (e) {
                console.error("Varsayılan kategori atama hatası:", e);
              }
            }

            console.log("Yeni haber oluşturuluyor: ", item.title);

            // Yeni haber oluştur
            const news = await News.create({
              title: item.title?.trim(),
              content: fullContent,
              description: description.substring(
                0,
                Math.min(description.length, 300)
              ),
              imageUrl,
              url, // Haber URL'sini kaydet
              source: source.source,
              author: item.creator || item.author || source.source,
              category: source.category, // Kategori bilgisini doğrudan kaydet
              publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              externalId,
            });

            // Kategori ilişkisini kur
            if (categoryIds.length > 0 && news) {
              // Many-to-many ilişki için
              await news.$add("categories", categoryIds);
              console.log(
                `"${
                  news.title
                }" haberi kategorilere eklendi. Kategori ID'leri: ${categoryIds.join(
                  ", "
                )}`
              );
            } else {
              console.warn(
                `"${news.title}" haberi için kategori ilişkisi kurulamadı.`
              );
            }

            totalSaved++;
            console.log(`Yeni haber eklendi: ${news.title}`);
          } catch (error) {
            console.error(`Haber işlenirken hata: ${item.title}`, error);
            totalErrors++;
          }

          // API throttling - aşırı istek yapmamak için kısa bir bekleme
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log(`${source.source} kaynağından haberler başarıyla çekildi.`);

        // Kaynaklar arası bekleme
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
