import {Router} from "express";
import { toggleLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:videoId/toggle-like", verifyJWT, toggleLike);

export default router;
