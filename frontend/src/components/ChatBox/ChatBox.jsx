/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { useToast } from "../../context/ToastContext";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ProfileModal from "./ProfileModal";
import RenameGroupModal from "./RenameGroupModal";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);

  const {
    selectedChat,
    setSelectedChat,
    user,
    setChats,
    socket, 
    setNotifications// ✅ directly from ChatState
  } = ChatState();

  const { showToast } = useToast();

  // ✅ Fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);

      // ✅ Join the socket room for this chat
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error(error);
      showToast("Failed to load messages", "error");
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    setMessages([]);
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Socket listener for new messages
  // inside useEffect where socket listens to "message received"
  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessage) => {
      if (selectedChat && newMessage.chat._id === selectedChat._id) {
        // current chat open → just append
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // not open → add notification
        setNotifications((prev) => {
          // avoid duplicate notifications for same message
          if (prev.find((n) => n._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", (userData) => {
      setTypingUser(userData);
    });

    socket.on("stop typing", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket, selectedChat]);

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const tempMsg = {
      _id: Date.now(),
      sender: { _id: user._id, name: user.name, pic: user.pic },
      content: message,
      chat: selectedChat._id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setMessage("");

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        "/api/message",
        { content: tempMsg.content, chatId: selectedChat._id },
        config
      );

      // Replace temp with real
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMsg._id ? data : m))
      );

      // ✅ Emit message via socket
      socket.emit("new message", data);
    } catch (error) {
      console.error(error);
      showToast("Failed to send message", "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Remove user from group
  const handleRemoveUser = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/remove-from-group",
        { chatId: selectedChat._id, userId },
        config
      );

      if (userId === user._id) {
        setSelectedChat(null);
        setProfileModalOpen(false);
        showToast("You have left the group", "success");
      } else {
        setSelectedChat(data);
        setChats((prev) => prev.map((c) => (c._id === data._id ? data : c)));
        showToast("User removed from group", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to remove user", "error");
    }
  };

  // Rename group
  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/rename-group",
        { chatId: selectedChat._id, chatName: newGroupName },
        config
      );

      setSelectedChat((prev) => ({ ...prev, chatName: data.chatName }));
      setChats((prev) =>
        prev.map((c) =>
          c._id === data._id ? { ...c, chatName: data.chatName } : c
        )
      );

      setRenameModalOpen(false);
      setNewGroupName("");
      showToast("Group renamed successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to rename group", "error");
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 bg-white rounded-[5px] text-black shadow-md p-3 ml-2 flex items-center justify-center h-[84vh]">
        <p className="text-gray-500 text-lg">
          Click on a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="h-[84vh] flex-1 bg-white rounded-[5px] text-black shadow-md p-3 ml-2 flex flex-col">
      {/* Header */}
      <ChatHeader
        selectedChat={selectedChat}
        user={user}
        setRenameModalOpen={setRenameModalOpen}
        setProfileModalOpen={setProfileModalOpen}
        setNewGroupName={setNewGroupName}
      />

      {/* Messages */}
      <ChatMessages
        messages={messages}
        user={user}
        selectedChat={selectedChat}
        messagesEndRef={messagesEndRef}
        typingUser={typingUser}
      />

      {/* Input */}
      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
      />

      {/* Modals */}
      {profileModalOpen && (
        <ProfileModal
          selectedChat={selectedChat}
          user={user}
          handleRemoveUser={handleRemoveUser}
          setProfileModalOpen={setProfileModalOpen}
        />
      )}

      {renameModalOpen && (
        <RenameGroupModal
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
          handleRenameGroup={handleRenameGroup}
          setRenameModalOpen={setRenameModalOpen}
        />
      )}
    </div>
  );
};

export default ChatBox;
