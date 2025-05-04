import { Router } from "express";
import authRoutes from "./routes/auth.routes";

const router = Router();

// Auth servisinin alt rotalarını bağlama
router.use("/", authRoutes);

export default router;
