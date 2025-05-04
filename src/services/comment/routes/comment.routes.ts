import { Router } from "express";
import * as commentController from "../controllers/comment.controller";
import {
  verifyTokenMiddleware,
  isAdmin,
} from "../../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Yorum yönetimi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - userId
 *         - newsId
 *       properties:
 *         id:
 *           type: integer
 *           description: Yorum ID
 *         content:
 *           type: string
 *           description: Yorum içeriği
 *         userId:
 *           type: integer
 *           description: Yorum yapan kullanıcı ID
 *         newsId:
 *           type: integer
 *           description: Yorumun yapıldığı haber ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 */

/**
 * @swagger
 * /comments/news/{newsId}:
 *   get:
 *     summary: Belirli bir habere ait yorumları getir
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: newsId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Haber ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına yorum sayısı
 *     responses:
 *       200:
 *         description: Yorumlar listesi
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
 *                     $ref: '#/components/schemas/Comment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get("/news/:newsId", commentController.getCommentsByNewsId);

/**
 * @swagger
 * /comments/user/{userId}:
 *   get:
 *     summary: Belirli bir kullanıcıya ait yorumları getir
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kullanıcı ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına yorum sayısı
 *     responses:
 *       200:
 *         description: Yorumlar listesi
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
 *                     $ref: '#/components/schemas/Comment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get("/user/:userId", commentController.getCommentsByUserId);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Yeni yorum oluştur
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - newsId
 *             properties:
 *               content:
 *                 type: string
 *               newsId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Yorum başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz veriler
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Haber bulunamadı
 */
router.post("/", verifyTokenMiddleware, commentController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Yorumu güncelle
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Yorum ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yorum başarıyla güncellendi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Bu yorumu düzenleme yetkiniz yok
 *       404:
 *         description: Yorum bulunamadı
 */
router.put("/:id", verifyTokenMiddleware, commentController.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Yorumu sil
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Yorum ID
 *     responses:
 *       200:
 *         description: Yorum başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Bu yorumu silme yetkiniz yok
 *       404:
 *         description: Yorum bulunamadı
 */
router.delete("/:id", verifyTokenMiddleware, commentController.deleteComment);

export default router;
