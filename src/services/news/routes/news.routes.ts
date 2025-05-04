import { Router } from "express";
import * as newsController from "../controllers/news.controller";
import {
  verifyTokenMiddleware,
  isAdmin,
} from "../../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Haber yönetimi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: Haber ID
 *         title:
 *           type: string
 *           description: Haber başlığı
 *         content:
 *           type: string
 *           description: Haber içeriği
 *         imageUrl:
 *           type: string
 *           description: Haber görsel URL'i
 *         source:
 *           type: string
 *           description: Haber kaynağı
 *         author:
 *           type: string
 *           description: Haber yazarı
 *         category:
 *           type: string
 *           description: Haber kategorisi
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           description: Haber yayın tarihi
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Tüm haberleri listele
 *     tags: [News]
 *     parameters:
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
 *         description: Sayfa başına haber sayısı
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategori filtresi
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Arama anahtar kelimesi
 *     responses:
 *       200:
 *         description: Haberler listesi
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
 *                     $ref: '#/components/schemas/News'
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
router.get("/", newsController.getAllNews);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Belirli bir haberi getir
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Haber ID
 *     responses:
 *       200:
 *         description: Haber detayı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: Haber bulunamadı
 */
router.get("/:id", newsController.getNewsById);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Yeni haber oluştur
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               source:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Haber başarıyla oluşturuldu
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetki hatası
 */
router.post("/", verifyTokenMiddleware, isAdmin, newsController.createNews);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Haberi güncelle
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Haber ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               source:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Haber başarıyla güncellendi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetki hatası
 *       404:
 *         description: Haber bulunamadı
 */
router.put("/:id", verifyTokenMiddleware, isAdmin, newsController.updateNews);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Haberi sil
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Haber ID
 *     responses:
 *       200:
 *         description: Haber başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetki hatası
 *       404:
 *         description: Haber bulunamadı
 */
router.delete(
  "/:id",
  verifyTokenMiddleware,
  isAdmin,
  newsController.deleteNews
);

/**
 * @swagger
 * /news/fetch/external:
 *   get:
 *     summary: Harici haber API'sinden haberleri çek
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           default: general
 *         description: Haber kategorisi
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           default: tr
 *         description: Ülke kodu
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Çekilecek haber sayısı
 *     responses:
 *       200:
 *         description: Haberler başarıyla çekildi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetki hatası
 */
router.get(
  "/fetch/external",
  verifyTokenMiddleware,
  isAdmin,
  newsController.fetchExternalNews
);

export default router;
