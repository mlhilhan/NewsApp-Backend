"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const router = (0, express_1.Router)();
// Ana haber rotaları
router.use("/", news_routes_1.default);
// Kategori rotaları
router.use("/categories", category_routes_1.default);
exports.default = router;
