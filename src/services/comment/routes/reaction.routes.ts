import { Router } from "express";
import * as reactionController from "../controllers/reaction.controller";
import { verifyTokenMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reactions
 *   description: Reaksiyon (beğeni) yönetimi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reaction:
 *       type: object
 *       required:
 *         - userId
 *         - newsId
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *           description: Reaksiyon ID
 *         userId:
 *           type: integer
 *           description: Reaksiyon yapan kullanıcı ID
 *         newsId:
 *           type: integer
 *           description: Reaksiyonun yapıldığı haber ID
 *         type:
 *           type: string
 *           enum: [like, dislike, angry, happy, sad, surprised]
 *           description: Reaksiyon tipi
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *     ReactionCount:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [like, dislike, angry, happy, sad, surprised]
 *         count:
 *           type: integer
 */

/**
 * @swagger
 * /reactions/news/{newsId}:
 *   get:
 *     summary: Belirli bir habere ait reaksiyonları getir
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: newsId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Haber ID
 *     responses:
 *       200:
 *         description: Reaksiyonlar listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReactionCount'
 *       404:
 *         description: Haber bulunamadı
 */
router.get("/news/:newsId", reactionController.getReactionsByNewsId);

/**
 * @swagger
 * /reactions/user/news/{newsId}:
 *   get:
 *     summary: Belirli bir habere ait kullanıcı reaksiyonunu getir
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Haber ID
 *     responses:
 *       200:
 *         description: Kullanıcı reaksiyonu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Reaction'
 */
router.get(
  "/user/news/:newsId",
  verifyTokenMiddleware,
  reactionController.getUserReactionByNewsId
);

/**
 * @swagger
 * /reactions:
 *   post:
 *     summary: Reaksiyon ekle veya güncelle
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newsId
 *               - type
 *             properties:
 *               newsId:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [like, dislike, angry, happy, sad, surprised]
 *     responses:
 *       200:
 *         description: Reaksiyon güncellendi veya kaldırıldı
 *       201:
 *         description: Reaksiyon eklendi
 *       400:
 *         description: Geçersiz reaksiyon tipi
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Haber bulunamadı
 */
router.post("/", verifyTokenMiddleware, reactionController.addOrUpdateReaction);

/**
 * @swagger
 * /reactions/news/{newsId}:
 *   delete:
 *     summary: Reaksiyonu kaldır
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Haber ID
 *     responses:
 *       200:
 *         description: Reaksiyon başarıyla kaldırıldı
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Reaksiyon bulunamadı
 */
router.delete(
  "/news/:newsId",
  verifyTokenMiddleware,
  reactionController.removeReaction
);

export default router;
