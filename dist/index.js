"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
// Yapılandırma ve yardımcılar
const database_1 = __importStar(require("./config/database"));
const error_middleware_1 = require("./middlewares/error.middleware");
// Servisler
const index_1 = __importDefault(require("./services/auth/index"));
const index_2 = __importDefault(require("./services/news/index"));
const index_3 = __importDefault(require("./services/comment/index"));
// Ortam değişkenlerini yükle
dotenv_1.default.config();
// Express uygulamasını oluştur
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3000;
// Middleware'leri ekle
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// Ana route
app.get("/", (req, res) => {
    res.json({
        service: "Haber Uygulaması API",
        status: "active",
        timestamp: new Date(),
    });
});
// API belgelendirmesi için Swagger UI
app.use("/api-docs", swagger_ui_express_1.default.serve);
app.get("/api-docs", swagger_ui_express_1.default.setup(swagger_1.default, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
}));
// Servisleri bağla
app.use("/api/auth", index_1.default);
app.use("/api/news", index_2.default);
app.use("/api", index_3.default);
// 404 handler
app.use(error_middleware_1.notFoundHandler);
// Global error handler
app.use(error_middleware_1.errorHandler);
// Sunucuyu başlat
const startServer = async () => {
    try {
        // Veritabanı bağlantısını test et
        await (0, database_1.testConnection)();
        // Veritabanı tablolarını senkronize et (development ortamında)
        const forceSync = process.env.NODE_ENV === "development" &&
            process.env.DB_FORCE_SYNC === "true";
        await (0, database_1.syncDatabase)(forceSync);
        // Sunucuyu başlat
        app.listen(PORT, () => {
            console.log(`
🚀 Server running on port ${PORT}
📝 API Documentation: http://localhost:${PORT}/api-docs
🌐 Environment: ${process.env.NODE_ENV}
      `);
        });
    }
    catch (error) {
        console.error("Sunucu başlatılamadı:", error);
        process.exit(1);
    }
};
// Uygulamayı başlat
startServer();
// Süreç sonlandırma yönetimi
process.on("SIGINT", async () => {
    try {
        await database_1.default.close();
        console.log("Veritabanı bağlantısı kapatıldı.");
        process.exit(0);
    }
    catch (error) {
        console.error("Kapatma hatası:", error);
        process.exit(1);
    }
});
