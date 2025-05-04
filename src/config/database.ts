import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "../services/auth/models/user.model";
import UserPreference from "../services/auth/models/user-preference.model";
import News from "../services/news/models/news.model";
import Category from "../services/news/models/category.model";
import NewsCategory from "../services/news/models/news-category.model";
import Comment from "../services/comment/models/comment.model";
import Reaction from "../services/comment/models/reaction.model";

// .env dosyasını yükle
dotenv.config();

// Veritabanı bağlantı bilgileri
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "haber_db",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  dialect: "postgres" as const,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
};

// Sequelize örneğini oluşturma
const sequelize = new Sequelize({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging as any,
  models: [
    User,
    UserPreference,
    News,
    Category,
    NewsCategory,
    Comment,
    Reaction,
  ],
});

// Veritabanı bağlantısını test etme fonksiyonu
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("📦 Veritabanı bağlantısı başarıyla kuruldu.");
  } catch (error) {
    console.error("❌ Veritabanına bağlanılamadı:", error);
  }
};

// Tüm tabloları senkronize et
export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log(
      `🔄 Veritabanı tabloları ${
        force ? "yeniden oluşturuldu" : "senkronize edildi"
      }.`
    );
  } catch (error) {
    console.error("❌ Veritabanı senkronizasyon hatası:", error);
  }
};

export default sequelize;
