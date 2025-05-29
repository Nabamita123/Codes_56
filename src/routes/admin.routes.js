import express from "express";
import { verifyJWT , isAdmin} from "../middlewares/auth.middleware.js";
import { getAllUsers, deleteUser, deleteVideoByAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.use(verifyJWT, isAdmin);

router.route("/users").get(getAllUsers);
router.route("/user-delete/:userId").delete(deleteUser);
router.route("/delete-video/:videoId").delete(deleteVideoByAdmin);
export default router;
