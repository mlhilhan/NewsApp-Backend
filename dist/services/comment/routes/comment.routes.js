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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController = __importStar(require("../controllers/comment.controller"));
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route GET /api/comments/news/:newsId
 * @desc Belirli bir habere ait yorumları getir
 * @access Public
 */
router.get("/news/:newsId", commentController.getCommentsByNewsId);
/**
 * @route GET /api/comments/user/:userId
 * @desc Belirli bir kullanıcıya ait yorumları getir
 * @access Public
 */
router.get("/user/:userId", commentController.getCommentsByUserId);
/**
 * @route POST /api/comments
 * @desc Yeni yorum oluştur
 * @access Private
 */
router.post("/", auth_middleware_1.verifyTokenMiddleware, commentController.createComment);
/**
 * @route PUT /api/comments/:id
 * @desc Yorumu güncelle
 * @access Private
 */
router.put("/:id", auth_middleware_1.verifyTokenMiddleware, commentController.updateComment);
/**
 * @route DELETE /api/comments/:id
 * @desc Yorumu sil
 * @access Private
 */
router.delete("/:id", auth_middleware_1.verifyTokenMiddleware, commentController.deleteComment);
exports.default = router;
