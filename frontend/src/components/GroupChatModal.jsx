/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const GroupChatModal = ({ isOpen, onClose, fetchChats }) => {
  const { user } = ChatState();
  const { showToast } = useToast();

  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // 🔍 Search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return setSearchResult([]);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user/all?search=${query}`, config);
      setSearchResult(data);
    } catch (error) {
      console.error("Failed to load search results", error);
      showToast("error", "Failed to search users");
    }
  };

  // ➕ Add user
  const handleAddUser = (u) => {
    if (selectedUsers.find((sel) => sel._id === u._id)) {
      return showToast("warning", "User already added");
    }
    setSelectedUsers([...selectedUsers, u]);
    setSearch("");
  };

  // ❌ Remove user
  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== id));
  };

  // ✅ Create group
  const handleSubmit = async () => {
    if (!groupName || selectedUsers.length < 2) {
      return showToast("warning", "Please provide name & at least 2 users");
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        "/api/chat/create-group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
          pic: "http://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        config
      );

      showToast("Group Created!", "success");
      fetchChats();
      onClose();
    } catch (error) {
      console.error("Failed to create group", error);
      showToast("Failed to create group", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-[5px] text-black w-[500px] p-5 shadow-360 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Group Chat</h2>
              <IoClose
                className="text-2xl cursor-pointer text-gray-500 hover:text-black transition duration-300 ease-in-out"
                onClick={onClose}
              />
            </div>

            {/* Group Name */}
            <input
              type="text"
              placeholder="Group Name"
              className="w-full border px-4 py-2 mb-3 placeholder:text-gray-500 rounded-full bg-white outline-none"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            {/* Add Members */}
            <input
              type="text"
              placeholder="Add Members..."
              className="w-full border px-4 py-2 mb-3 placeholder:text-gray-500 rounded-full bg-white outline-none"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Selected Users */}
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {selectedUsers.map((u) => (
                  <motion.div
                    layout
                    key={u._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      layout: { type: 'spring', stiffness: 500, damping: 60 },
                      duration: 0.25, 
                      ease: "easeInOut" 
                    }}
                    className="flex items-center gap-2 bg-blue-500 text-white p-1 rounded-full text-sm"
                  >
                    <img
                      src={u.pic}
                      alt={u.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    {u.name}
                    <IoClose
                      className="cursor-pointer text-lg"
                      onClick={() => handleRemoveUser(u._id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Search Results */}
            <div className="max-h-[150px] overflow-y-auto space-y-2">
              {searchResult.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 p-2 border rounded-full cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
                  onClick={() => handleAddUser(u)}
                >
                  <img
                    src={u.pic}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Button */}
            <button
              className="w-full hover:bg-blue-500 hover:text-white text-blue-700 border border-blue-700 py-2 mt-4 rounded-full cursor-pointer transition duration-300 ease-in-out"
              onClick={handleSubmit}
            >
              Create Group
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GroupChatModal;