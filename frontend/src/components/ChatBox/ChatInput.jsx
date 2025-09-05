/* eslint-disable react/prop-types */
import { useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { ChatState } from "../../context/ChatProvider";

const ChatInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown,
}) => {
  const { socket, selectedChat, user } = ChatState(); // ✅ include user
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socket || !selectedChat) return;

    // ✅ Emit typing event with chatId + user info
    socket.emit("typing", selectedChat._id, {
      _id: user._id,
      name: user.name,
      pic: user.pic,
    });

    // ✅ Clear previous timeout if still typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // ✅ Stop typing after 2s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id, {
        _id: user._id,
        name: user.name,
        pic: user.pic,
      });
    }, 2000);
  };

  return (
    <div className="border-t border-gray-300 bg-gray-100 p-3">
      <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none px-2 text-xl"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`flex items-center justify-center rounded-full w-10 h-10 transition-colors duration-300 ease-in-out ${
            message.trim()
              ? "text-white cursor-pointer bg-blue-700"
              : "text-gray-400 bg-gray-200 cursor-not-allowed"
          }`}
        >
          <IoMdSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;