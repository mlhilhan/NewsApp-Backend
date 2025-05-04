import { Router } from "express";
import newsRoutes from "./routes/news.routes";

const router = Router();

// Ana haber rotaları
router.use("/", newsRoutes);

export default router;
