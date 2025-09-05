import { useState } from "react";
import { IoClose, IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import AddMembersModal from "./AddMembersModal";

/* eslint-disable react/prop-types */
const ProfileModal = ({
  selectedChat,
  user,
  handleRemoveUser,
  setProfileModalOpen,
  fetchChats,
  setChats,
}) => {
  const [addMembersModalOpen, setAddMembersModalOpen] = useState(false);

  if (!selectedChat) return null;

  const otherUser = !selectedChat.isGroupChat
    ? selectedChat.users.find((u) => u._id !== user._id)
    : null;

  // Sort users: admin last
  const sortedUsers = selectedChat.isGroupChat
    ? [
        ...selectedChat.users.filter(
          (u) => u._id !== selectedChat.groupAdmin._id
        ),
        selectedChat.groupAdmin,
      ]
    : [];

  const handleRemove = async (userId) => {
    try {
      await handleRemoveUser(userId);
      await fetchChats();

      if (userId === user._id) {
        setChats((prevChats) =>
          prevChats.filter((c) => c._id !== selectedChat._id)
        );
        setProfileModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
  };

  return (
    <AnimatePresence>
      {selectedChat && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Group Chat Modal */}
          {selectedChat.isGroupChat ? (
            <motion.div
              className="bg-white rounded-[5px] shadow-360 w-[400px] relative max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <div className="flex justify-center items-center relative border-b p-4">
                <h2 className="text-2xl font-semibold text-center truncate">
                  {selectedChat.chatName}
                </h2>
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-300 ease-in-out cursor-pointer"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                  <img
                    src={
                      selectedChat.pic ||
                      "http://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt="group avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {selectedChat.users.length} members
                </h3>

                <div className="flex flex-col gap-2 mb-4">
                  {sortedUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={u.pic}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>
                          {u._id === selectedChat.groupAdmin._id
                            ? "You"
                            : u.name}
                        </span>
                      </div>
                      {selectedChat.groupAdmin._id === user._id &&
                        u._id !== user._id && (
                          <button
                            onClick={() => handleRemove(u._id)}
                            className="text-red-500 hover:text-red-700 text-sm cursor-pointer transition-colors duration-300 ease-in-out"
                          >
                            Remove
                          </button>
                        )}
                    </div>
                  ))}
                </div>

                {selectedChat.groupAdmin._id === user._id && (
                  <button
                    onClick={() => setAddMembersModalOpen(true)}
                    className="mb-3 w-full px-4 py-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 text-blue-700 border border-blue-700 rounded-full transition duration-300 ease-in-out cursor-pointer flex justify-center items-center gap-2"
                  >
                    Add Members
                    <IoPersonAdd />
                  </button>
                )}

                <button
                  onClick={() => handleRemove(user._id)}
                  className="w-full px-4 py-2 hover:bg-red-500 hover:text-white hover:border-red-500 border border-red-700 text-red-700 rounded-full transition-colors duration-300 ease-in-out cursor-pointer flex justify-center items-center gap-2"
                >
                  Leave Group
                  <IoPersonRemove />
                </button>
              </div>
            </motion.div>
          ) : (
            // Personal Chat Modal
            <motion.div
              className="bg-white rounded-[5px] shadow-lg w-[320px] relative p-6 text-center"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <button
                onClick={() => setProfileModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer transition-colors duration-300 ease-in-out"
              >
                <IoClose size={24} />
              </button>
              <h2 className="text-2xl font-semibold mb-4">{otherUser?.name}</h2>
              <div className="w-24 h-24 mx-auto rounded-full p-[3px]">
                <img
                  src={
                    otherUser?.pic ||
                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  alt={otherUser?.name}
                  className="w-full h-full rounded-full border-4 border-white object-cover"
                />
              </div>
              <p className="mt-6 text-gray-700 text-lg">
                Email: {otherUser?.email}
              </p>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="mt-6 px-4 py-1 rounded-full border border-red-700 text-red-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-300 ease-in-out text-sm cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          )}

          {addMembersModalOpen && (
            <AddMembersModal
              onClose={() => setAddMembersModalOpen(false)}
              selectedChat={selectedChat}
              fetchChats={fetchChats}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;