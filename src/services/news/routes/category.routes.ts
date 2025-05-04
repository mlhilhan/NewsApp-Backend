import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import {
  verifyTokenMiddleware,
  isAdmin,
} from "../../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Kategori yönetimi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         id:
 *           type: integer
 *           description: Kategori ID
 *         name:
 *           type: string
 *           description: Kategori adı
 *         slug:
 *           type: string
 *           description: Kategori URL slug'ı
 *         description:
 *           type: string
 *           description: Kategori açıklaması
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Tüm kategorileri listele
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Kategoriler listesi
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
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Belirli bir kategoriyi getir
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kategori ID
 *     responses:
 *       200:
 *         description: Kategori detayı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Kategori bulunamadı
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Yeni kategori oluştur
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz veriler
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetki hatası
 */
router.post(
  "/",
  verifyTokenMiddleware,
  isAdmin,
  categoryController.createCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Kategoriyi güncelle
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kategori ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategori başarıyla güncellendi
 *       400:
 *         description: Geçersiz veriler
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetki hatası
 *       404:
 *         description: Kategori bulunamadı
 */
router.put(
  "/:id",
  verifyTokenMiddleware,
  isAdmin,
  categoryController.updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Kategoriyi sil
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kategori ID
 *     responses:
 *       200:
 *         description: Kategori başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetki hatası
 *       404:
 *         description: Kategori bulunamadı
 */
router.delete(
  "/:id",
  verifyTokenMiddleware,
  isAdmin,
  categoryController.deleteCategory
);

export default router;
