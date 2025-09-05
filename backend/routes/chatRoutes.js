import express from "express";
import { accessChat, fetchChats, fetchSingleChat, createGroup, renameGroup, addToGroup, removeFromGroup } from "../controllers/chatControllers.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.get("/:chatId", protect, fetchSingleChat);
router.post("/create-group", protect, createGroup);
router.put("/rename-group", protect, renameGroup);
router.put("/add-to-group", protect, addToGroup);
router.put("/remove-from-group", protect, removeFromGroup);

export default router;