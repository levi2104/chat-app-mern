/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const ChatContext = createContext();
let socket; // keep socket outside to avoid re-creation

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);

      // ✅ initialize socket connection when user is logged in
      socket = io("http://localhost:3000"); // backend server URL
      socket.emit("setup", userInfo); // send user info to backend
      socket.on("connected", () => setSocketConnected(true));
    } else {
      navigate("/");
    }

    // cleanup socket on logout/unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(data.filter((noti) => !noti.isRead)); // only unseen
    };
    if (user) fetchNotifications();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notifications,
        setNotifications,
        chats,
        setChats,
        socket,
        socketConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;