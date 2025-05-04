"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.testConnection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// .env dosyası
dotenv_1.default.config();
// Model dosyalarının yolu
const modelsPath = path_1.default.join(__dirname, "../services/**/models");
// Veritabanı bağlantı bilgileri
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "news_db",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
};
// Sequelize örneği
const sequelize = new sequelize_typescript_1.Sequelize({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    models: [modelsPath],
    define: {
        timestamps: true,
        underscored: true,
    },
});
// Veritabanı bağlantısını test etme fonksiyonu
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("📦 Veritabanı bağlantısı başarıyla kuruldu.");
    }
    catch (error) {
        console.error("❌ Veritabanına bağlanılamadı:", error);
    }
};
exports.testConnection = testConnection;
// Tüm tabloları senkronize et
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log(`🔄 Veritabanı tabloları ${force ? "yeniden oluşturuldu" : "senkronize edildi"}.`);
    }
    catch (error) {
        console.error("❌ Veritabanı senkronizasyon hatası:", error);
    }
};
exports.syncDatabase = syncDatabase;
exports.default = sequelize;
