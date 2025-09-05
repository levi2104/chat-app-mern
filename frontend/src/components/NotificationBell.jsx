import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { BsBell } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = () => {
  const { notifications, setNotifications, setSelectedChat, user } =
    ChatState();
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  // Group notifications by chat
  const groupedNotifications = notifications.reduce((acc, n) => {
    const chatId = n.chat._id;
    if (!acc[chatId]) {
      acc[chatId] = {
        chat: n.chat,
        sender: n.sender,
        count: 0,
      };
    }
    acc[chatId].count += 1;
    return acc;
  }, {});

  const unreadCount = notifications.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ✅ handle opening chat from notification
  const handleOpenChat = async (chatId) => {
    try {
      // 1. Fetch full chat details (important!)
      const { data } = await axios.get(`/api/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // 2. Set chat in context
      setSelectedChat(data);

      // 3. Mark notifications as read
      await axios.put(
        "/api/notifications/mark",
        { chatId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // 4. Remove them from frontend state
      setNotifications((prev) =>
        prev.filter((noti) => noti.chat._id !== chatId)
      );

      // 5. Navigate to chats page
      navigate("/chats");

      setOpen(false);
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  return (
    <div ref={bellRef} className="relative text-black">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-500 hover:text-black transition-colors ease-in-out"
      >
        <BsBell size={20} />
        {unreadCount > 0 && (
          <span
            className={`absolute top-0 right-1 ${
              unreadCount > 9 && "-right-[4px]"
            } bg-blue-700 text-white text-[9px] bold-fonts rounded-full px-1.5 py-0.5`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 top-10 w-64 bg-white shadow-360 rounded-[5px] z-50 p-4 max-h-[50vh] overflow-y-auto"
          >
            <h3 className="font-semibold mb-2 text-black">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-600">No new notifications</p>
            ) : (
              Object.values(groupedNotifications).map((group) => (
                <div
                  key={group.chat._id}
                  onClick={() => handleOpenChat(group.chat._id)}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm transition duration-300 ease-in-out"
                >
                  {group.count > 9 ? (
                    <>
                      9+ new messages from{" "}
                      <span className="font-bold">
                        {group.chat.isGroupChat
                          ? group.chat.chatName
                          : group.sender.name}
                      </span>
                    </>
                  ) : (
                    <>
                      {group.count} new message
                      {group.count > 1 ? "s" : ""} from{" "}
                      <span className="font-bold">
                        {group.chat.isGroupChat
                          ? group.chat.chatName
                          : group.sender.name}
                      </span>
                    </>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;