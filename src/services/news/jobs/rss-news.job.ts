import cron from "node-cron";
import { fetchNewsFromRSS } from "../utils/rss-parser";

/**
 * Zamanlanmış RSS haber çekme işini başlatır
 */
export const startRSSNewsJob = (): void => {
  // Her 1 dakikada bir çalıştır (0, 15, 30, 45 dakikalarda)
  cron.schedule("*/1 * * * *", async () => {
    console.log("RSS haber çekme işi başlatıldı:", new Date().toISOString());
    try {
      await fetchNewsFromRSS();
      console.log("RSS haber çekme işi tamamlandı:", new Date().toISOString());
    } catch (error) {
      console.error("RSS haber çekme işi hatası:", error);
    }
  });

  console.log("RSS haber çekme zamanlanmış görevi başlatıldı");
};
