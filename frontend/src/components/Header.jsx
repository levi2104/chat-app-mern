/* eslint-disable react-hooks/exhaustive-deps */
import { CiSearch } from "react-icons/ci";
import NotificationBell from "./NotificationBell";
import { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiUserLight } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChatState } from "../context/ChatProvider";

const Header = () => {
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setUser, setChats, chats, setSelectedChat } = ChatState();

  // get userInfo from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    gsap.set(drawerRef.current, { x: "-100%" });
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(drawerRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [drawerOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch users (supports search query)
  const fetchUsers = async (query = "") => {
    setLoadingUsers(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user/all${query ? `?search=${query}` : ""}`,
        config
      );
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("error", "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Open drawer & fetch all users initially
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    fetchUsers();
  };

  // Live search (fetch as user types)
  useEffect(() => {
    if (drawerOpen) {
      const delayDebounce = setTimeout(() => {
        fetchUsers(search);
      }, 400);
      return () => clearTimeout(delayDebounce);
    }
  }, [search, drawerOpen]);

  // Handle accessChat (create/open chat)
  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error accessing chat:", error);
      showToast("error", "Failed to create/open chat");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setChats([]);
    setSelectedChat();
    setLogoutConfirmOpen(false);
    showToast("Logged out successfully", "success");
    navigate("/");
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center bg-white px-6 py-3 shadow-md">
        {/* Left - Search */}
        <div
          className="flex items-center bg-gray-100 border border-gray-700 rounded-full px-2 py-1 max-w-[200px] cursor-pointer"
          onClick={handleOpenDrawer}
        >
          <CiSearch size={20} className="text-black mr-2" />
          <input
            type="text"
            placeholder="Search User"
            readOnly
            className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
          />
        </div>

        {/* Center - App Title */}
        <div>
          <h1 className="w-48 text-3xl bold-fonts text-gray-800">ChatUp!</h1>
        </div>

        {/* Right - Notifications + Profile */}
        <div className="flex items-center gap-6 relative">
          <NotificationBell />
          <div
            ref={profileMenuRef}
            className="relative flex items-center gap-1 text-black cursor-pointer"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
          >
            <img
              src={
                userInfo?.pic ||
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              }
              alt={userInfo?.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <IoMdArrowDropdown />

            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute right-0 top-10 w-28 bg-white shadow-360 rounded-[5px] z-50"
                >
                  <button
                    className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors ease-in-out"
                    onClick={() => {
                      setProfileModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                  >
                    My Profile
                    <PiUserLight />
                  </button>
                  <button
                    className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors ease-in-out"
                    onClick={() => {
                      setLogoutConfirmOpen(true);
                      setProfileMenuOpen(false);
                    }}
                  >
                    Logout
                    <CiLogout style={{ transform: "rotate(180deg)" }} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 left-0 h-full w-64 bg-white text-black shadow-360 z-50 p-4 overflow-y-auto"
      >
        <h2 className="text-xl font-semibold mb-4 mt-8">Search Users</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border placeholder:text-gray-500 placeholder:text-sm rounded-full pl-3 py-1 w-full outline-none bg-gray-100"
          />
        </div>

        <div>
          {loadingUsers ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-2 rounded-[5px] bg-gray-100 animate-pulse mb-2"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </>
          ) : users.length !== 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => accessChat(user._id)}
                className="flex items-center space-x-3 p-2 rounded-[5px] hover:bg-gray-100 cursor-pointer mb-2 transition duration-300 ease-in-out"
              >
                {user.pic ? (
                  <img
                    src={user.pic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gray-500">
                    {user.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <span>No users found :(</span>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {profileModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white rounded-[5px] shadow-360 w-[320px] relative p-6 text-center"
            >
              <button
                onClick={() => setProfileModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer transition duration-300 ease-in-out"
              >
                <IoClose size={24} />
              </button>
              <h2 className="text-2xl font-semibold mb-4">{userInfo?.name}</h2>
              <div className="w-24 h-24 mx-auto rounded-full p-[3px]">
                <img
                  src={
                    userInfo?.pic ||
                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  alt={userInfo?.name}
                  className="w-full h-full rounded-full border-4 border-white object-cover"
                />
              </div>
              <p className="mt-6 text-gray-700 text-lg">
                Email: {userInfo?.email}
              </p>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="mt-6 px-3 py-1 rounded-full border border-red-700 text-red-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-300 ease-in-out text-sm cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {logoutConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white rounded-[5px] shadow-360 w-[320px] p-6 text-center"
            >
              <h2 className="text-lg font-semibold mb-4">
                Are you sure you want to logout?
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-5 py-1 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-full border border-red-700 text-red-700 cursor-pointer transition-colors duration-300 ease-in-out"
                >
                  Yes
                </button>
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="px-5 py-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 rounded-full border border-blue-700 text-blue-700 cursor-pointer transition-colors duration-300 ease-in-out"
                >
                  No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;