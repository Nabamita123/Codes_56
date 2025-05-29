import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getSubscriptions,
  getSubscribers
} from "../controllers/subscription.controller.js";

const router = Router();

router.post("/:channelId/toggle-subscribe", verifyJWT, toggleSubscription);
router.get("/my-subscriptions", verifyJWT, getSubscriptions);
router.get("/:channelId/subscribers", getSubscribers);

export default router;
