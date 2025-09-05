/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import GroupChatModal from "./GroupChatModal";
import { FaUsers } from "react-icons/fa";

const MyChats = () => {
  const {
    chats,
    setChats,
    setSelectedChat,
    selectedChat,
    user,
    notifications,
    setNotifications,
    socket,
  } = ChatState();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch chats from backend
  const fetchChats = async () => {
    try {
      if (!user?.token) return;
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats", error);
      showToast("error", "Failed to load chats");
    }
  };

  useEffect(() => {
    if (user?.token) {
      setChats([]);
      setSelectedChat(null);
      fetchChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user?._id]);

  // ✅ Listen for new messages and update chats instantly
  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessage) => {
      setChats((prevChats) => {
        const chatExists = prevChats.find((c) => c._id === newMessage.chat._id);

        if (chatExists) {
          const updatedChats = prevChats.map((c) =>
            c._id === newMessage.chat._id
              ? { ...c, latestMessage: newMessage }
              : c
          );

          const sortedChats = [
            updatedChats.find((c) => c._id === newMessage.chat._id),
            ...updatedChats.filter((c) => c._id !== newMessage.chat._id),
          ];

          return sortedChats;
        } else {
          return [newMessage.chat, ...prevChats];
        }
      });
    });

    return () => {
      socket.off("message received");
    };
  }, [socket]);

  return (
    <>
      {/* Modal */}
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchChats={fetchChats}
      />

      <div
        className="w-1/3 bg-white text-black rounded-[5px] shadow-md p-3 mr-2 
                    flex flex-col h-[84vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">Chats</h2>
          <button
            className="hover:bg-blue-500 hover:text-white hover:border-blue-500 px-3 py-1 text-sm text-blue-700 border border-blue-700 rounded-full cursor-pointer transition duration-300 ease-in-out"
            onClick={() => setIsModalOpen(true)}
          >
            <h3 className="flex justify-center items-center gap-2">
              New Group Chat <FaUsers size={18} />
            </h3>
          </button>
        </div>

        {/* Chat List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {chats && chats.length > 0 ? (
            chats.map((chat) => {
              const otherUser = !chat.isGroupChat
                ? chat.users.find((u) => u._id !== user._id)
                : null;

              const unreadCount = notifications.filter(
                (n) => n.chat._id === chat._id
              ).length;

              return (
                <div
                  key={chat._id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setNotifications((prev) =>
                      prev.filter((n) => n.chat._id !== chat._id)
                    );
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[5px] cursor-pointer transition duration-300 ease-in-out ${
                    selectedChat?._id === chat._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {/* Profile Picture */}
                  <img
                    src={
                      chat.isGroupChat
                        ? "http://localhost:3000/uploads/anonymous-avatar.jpg"
                        : otherUser?.pic ||
                          "http://localhost:3000/uploads/anonymous-avatar.jpg"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {chat.isGroupChat ? chat.chatName : otherUser?.name}
                    </p>
                    {chat.latestMessage && (
                      <p className="text-sm truncate">
                        <b>{chat.latestMessage.sender.name}: </b>
                        {chat.latestMessage.content.length > 40
                          ? chat.latestMessage.content.substring(0, 41) + "..."
                          : chat.latestMessage.content}
                      </p>
                    )}
                  </div>

                  {/* Unread Count Badge */}
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-blue-700 text-white text-xs font-bold rounded-full px-2 py-1">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No chats yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyChats;