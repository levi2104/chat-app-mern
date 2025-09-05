import Notification from "../models/notificationModel.js";

// Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate("sender", "name pic")
    .populate("chat", "chatName isGroupChat users")
    .populate("message", "content")
    .sort({ createdAt: -1 });

  res.json(notifications);
};

// Mark notification(s) as read
export const markAsRead = async (req, res) => {
  const { chatId } = req.body;

  await Notification.updateMany(
    { user: req.user._id, chat: chatId },
    { $set: { isRead: true } }
  );

  res.json({ success: true });
};