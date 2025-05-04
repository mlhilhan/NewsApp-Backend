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
const reactionController = __importStar(require("../controllers/reaction.controller"));
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route GET /api/reactions/news/:newsId
 * @desc Belirli bir habere ait reaksiyonları getir
 * @access Public
 */
router.get("/news/:newsId", reactionController.getReactionsByNewsId);
/**
 * @route GET /api/reactions/user/news/:newsId
 * @desc Belirli bir habere ait kullanıcı reaksiyonunu getir
 * @access Private
 */
router.get("/user/news/:newsId", auth_middleware_1.verifyTokenMiddleware, reactionController.getUserReactionByNewsId);
/**
 * @route POST /api/reactions
 * @desc Reaksiyon ekle veya güncelle
 * @access Private
 */
router.post("/", auth_middleware_1.verifyTokenMiddleware, reactionController.addOrUpdateReaction);
/**
 * @route DELETE /api/reactions/news/:newsId
 * @desc Reaksiyonu kaldır
 * @access Private
 */
router.delete("/news/:newsId", auth_middleware_1.verifyTokenMiddleware, reactionController.removeReaction);
exports.default = router;
