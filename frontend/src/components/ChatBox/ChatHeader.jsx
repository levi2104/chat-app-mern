/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FaPen } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useState } from "react";

const ChatHeader = ({
  selectedChat,
  user,
  setRenameModalOpen,
  setProfileModalOpen,
  setNewGroupName,
}) => {

  const [isOpen, setIsOpen] = useState(false)
  const otherUser = !selectedChat.isGroupChat
    ? selectedChat.users.find((u) => u._id !== user._id)
    : null;

  return (
    <div className="flex justify-between items-center mb-3 border-b pb-2">
      <div className="flex gap-4 items-center">
        <img
          src={
            selectedChat.isGroupChat
              ? selectedChat.pic ||
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              : otherUser?.pic ||
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          }
          alt="chat avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="text-2xl font-semibold truncate">
          {selectedChat.isGroupChat ? selectedChat.chatName : otherUser?.name}
        </h2>
      </div>

      <div className="flex gap-1">
        {selectedChat.isGroupChat &&
          selectedChat.groupAdmin._id === user._id && (
            <button
              className="p-3 hover:bg-gray-100 hover:text-black text-gray-500 rounded-full cursor-pointer transition-colors duration-300 ease-in-out"
              onClick={() => {
                setIsOpen(true);
                setNewGroupName(selectedChat.chatName);
                setRenameModalOpen(true);
              }}
            >
              <FaPen size={16} />
            </button>
          )}

        <button
          className="p-2 hover:bg-gray-100 hover:text-black text-gray-500 rounded-full cursor-pointer transition-colors duration-300 ease-in-out"
          onClick={() => setProfileModalOpen(true)}
        >
          <IoMdEye size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;