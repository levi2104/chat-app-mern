import express from "express";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getNotifications); // GET unseen notifications
router.route("/mark").put(protect, markAsRead); // PUT mark as read

export default router;