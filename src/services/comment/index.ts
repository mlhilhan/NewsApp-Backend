import { Router } from "express";
import commentRoutes from "./routes/comment.routes";
import reactionRoutes from "./routes/reaction.routes";

const router = Router();

// Yorum rotaları
router.use("/comments", commentRoutes);

// Reaksiyon rotaları
router.use("/reactions", reactionRoutes);

export default router;
