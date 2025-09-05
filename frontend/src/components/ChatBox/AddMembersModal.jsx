/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { useToast } from "../../context/ToastContext";

const AddMembersModal = ({ onClose, selectedChat, fetchChats }) => {
  const { user } = ChatState();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return setSearchResult([]);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user/all?search=${query}`, config);
      setSearchResult(data);
    } catch (error) {
      console.error("Search failed", error);
      showToast("error", "Failed to search users");
    }
  };

  // Add to selected
  const handleAddUser = (u) => {
    if (selectedUsers.find((sel) => sel._id === u._id)) {
      return showToast("warning", "User already added");
    }
    setSelectedUsers([...selectedUsers, u]);
    setSearch("");
    setSearchResult([]);
  };

  // Remove from selected
  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== id));
  };

  // Submit add members
  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      return showToast("warning", "Please select at least one user");
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/add-to-group",
        {
          chatId: selectedChat._id,
          users: selectedUsers.map((u) => u._id),
        },
        config
      );

      showToast("Members added successfully", "success");
      fetchChats(); // refresh chats & group profile modal
      onClose();
    } catch (error) {
      console.error(error);
      showToast("Failed to add members", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-[5px] text-black w-[500px] p-5 shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Members</h2>
          <IoClose className="text-2xl cursor-pointer" onClick={onClose} />
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search Users..."
          className="w-full border p-2 mb-3 rounded bg-white outline-none"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Selected users */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((u) => (
            <span
              key={u._id}
              className="flex items-center gap-2 bg-teal-600 text-white p-1 rounded-full text-sm"
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
            </span>
          ))}
        </div>

        {/* Search results */}
        <div className="max-h-[150px] overflow-y-auto space-y-2">
          {searchResult.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-100"
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

        {/* Add members button */}
        <button
          className="w-full bg-teal-600 text-white py-2 mt-4 rounded hover:bg-teal-700 cursor-pointer"
          onClick={handleSubmit}
        >
          Add Members
        </button>
      </div>
    </div>
  );
};

export default AddMembersModal;