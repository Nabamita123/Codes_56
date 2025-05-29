import express from "express";
import { addToHistory, getWatchHistory } from "../controllers/watchHistory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:videoId", verifyJWT, addToHistory);
router.get("/", verifyJWT, getWatchHistory);

export default router;
