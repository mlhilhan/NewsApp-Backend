import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

/**
 * Harici resmi indirip yerel sunucuya kaydeder
 */
export const downloadImage = async (
  imageUrl: string
): Promise<string | null> => {
  try {
    if (!imageUrl) return null;

    // Resim URL'inden dosya adı oluştur
    const fileHash = crypto.createHash("md5").update(imageUrl).digest("hex");
    const fileExt = path.extname(imageUrl) || ".jpg";
    const fileName = `${fileHash}${fileExt}`;

    // Kaydedilecek dizin
    const uploadDir = path.join(process.cwd(), "public", "uploads", "news");

    // Dizin yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    const publicPath = `/uploads/news/${fileName}`;

    // Dosya zaten varsa, doğrudan yolu döndür
    if (fs.existsSync(filePath)) {
      return publicPath;
    }

    // Resmi indir
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 10000,
    });

    // Dosyaya kaydet
    fs.writeFileSync(filePath, response.data);

    return publicPath;
  } catch (error) {
    console.error(`Resim indirme hatası: ${imageUrl}`, error);
    return null;
  }
};
