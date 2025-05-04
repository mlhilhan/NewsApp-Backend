import { Router } from "express";
import newsRoutes from "./routes/news.routes";
import categoryRoutes from "./routes/category.routes";

const router = Router();

// Ana haber rotaları
router.use("/", newsRoutes);

// Kategori rotaları
router.use("/categories", categoryRoutes);

export default router;
