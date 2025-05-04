"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const news_model_1 = __importDefault(require("./news.model"));
const category_model_1 = __importDefault(require("./category.model"));
let NewsCategory = class NewsCategory extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => news_model_1.default),
    (0, sequelize_typescript_1.Column)({
        field: "news_id",
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], NewsCategory.prototype, "newsId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => category_model_1.default),
    (0, sequelize_typescript_1.Column)({
        field: "category_id",
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], NewsCategory.prototype, "categoryId", void 0);
NewsCategory = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "news_categories",
        timestamps: false,
    })
], NewsCategory);
exports.default = NewsCategory;
