// src/index.ts
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

// Yapılandırma ve yardımcılar
import sequelize, { testConnection, syncDatabase } from "./config/database";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";

// Servisler
import authRoutes from "./services/auth/index";
import newsRoutes from "./services/news/index";
import commentRoutes from "./services/comment/index";

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app: Express = express();
const PORT = process.env.API_PORT || 3000;

// Middleware'leri ekle
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Ana route
app.get("/", (req, res) => {
  res.json({
    service: "Haber Uygulaması API",
    status: "active",
    timestamp: new Date(),
  });
});

// API belgelendirmesi için Swagger UI
app.use("/api-docs", swaggerUi.serve);
app.get(
  "/api-docs",
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// Servisleri bağla
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", commentRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Sunucuyu başlat
const startServer = async () => {
  try {
    // Veritabanı bağlantısını test et
    await testConnection();

    // Veritabanı tablolarını senkronize et (development ortamında)
    const forceSync =
      process.env.NODE_ENV === "development" &&
      process.env.DB_FORCE_SYNC === "true";
    await syncDatabase(forceSync);

    // Sunucuyu başlat
    app.listen(PORT, () => {
      console.log(`
🚀 Server running on port ${PORT}
📝 API Documentation: http://localhost:${PORT}/api-docs
🌐 Environment: ${process.env.NODE_ENV}
      `);
    });
  } catch (error) {
    console.error("Sunucu başlatılamadı:", error);
    process.exit(1);
  }
};

// Uygulamayı başlat
startServer();

// Süreç sonlandırma yönetimi
process.on("SIGINT", async () => {
  try {
    await sequelize.close();
    console.log("Veritabanı bağlantısı kapatıldı.");
    process.exit(0);
  } catch (error) {
    console.error("Kapatma hatası:", error);
    process.exit(1);
  }
});
