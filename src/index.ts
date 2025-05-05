import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cron from "node-cron";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import sequelize, { testConnection, syncDatabase } from "./config/database";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./services/auth/index";
import newsRoutes from "./services/news/index";
import commentRoutes from "./services/comment/index";
import categoryRoutes from "./services/news/routes/category.routes";
import { fetchExternalNewsJob } from "./services/news/jobs/news.jobs";
import { startRSSNewsJob } from "./services/news/jobs/rss-news.job";

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app: Express = express();
const PORT = process.env.API_PORT || 3000;

// Middleware'leri ekle
app.use(cors());
app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Ana route
app.get("/", (req, res) => {
  res.json({
    service: "News Application API",
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
app.use("/api/categories", categoryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", commentRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

cron.schedule("*/1 * * * *", async () => {
  console.log(
    "Her 15 dakikada bir haberleri çekme işi başlatıldı",
    new Date().toISOString()
  );
  try {
    await fetchExternalNewsJob();
    console.log("Haberler başarıyla güncellendi!");
  } catch (error) {
    console.error("Zamanlanmış haber çekme işi hatası:", error);
  }
});

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

    // RSS haber çekme zamanlanmış görevini başlat
    if (
      process.env.NODE_ENV === "production" ||
      process.env.ENABLE_RSS_JOB === "true"
    ) {
      startRSSNewsJob();
    }

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
