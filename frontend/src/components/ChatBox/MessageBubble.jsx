/* eslint-disable react/prop-types */
const MessageBubble = ({ message, user, selectedChat, messages, index }) => {
  const isMine = message.sender._id === user._id;
  const isGroup = selectedChat.isGroupChat;

  // ✅ Check if previous msg is from same sender
  const isSameSenderPrev = (messages, m, i) =>
    i > 0 && messages[i - 1].sender._id === m.sender._id;

  // ✅ Format time in hh:mm AM/PM
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`flex w-full mb-1 ${isMine ? "justify-end" : "justify-start"}`}
    >
      {/* 📩 Received (Left side) */}
      {!isMine && (
        <div
          className={`flex items-start gap-2 max-w-[75%] ${
            isGroup && isSameSenderPrev(messages, message, index) ? "ml-9" : ""
          }`}
        >
          {/* 👤 Avatar only in group chats & only if NOT consecutive */}
          {isGroup && !isSameSenderPrev(messages, message, index) && (
            <img
              src={message.sender.pic}
              alt={message.sender.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          )}

          <div
            className={`relative px-4 py-2 shadow-sm break-words inline-flex flex-col bg-white text-black
              ${
                isSameSenderPrev(messages, message, index)
                  ? "rounded-2xl" // ✅ consecutive -> fully rounded
                  : "rounded-2xl rounded-tl-none" // ✅ first message -> cut corner
              }`}
          >
            {/* Tail for received (only if it's FIRST in sequence) */}
            {!isSameSenderPrev(messages, message, index) && (
              <span
                className="absolute top-0 left-[-8px] w-0 h-0 
                border-b-[10px] border-t-transparent 
                border-r-[10px] border-r-white 
                border-t-[0px] border-b-transparent"
              />
            )}

            {/* 🟢 Sender Name (Group only, show only if NOT consecutive) */}
            {isGroup && !isSameSenderPrev(messages, message, index) && (
              <span className="text-teal-600 font-medium text-xs mb-1">
                {message.sender.name}
              </span>
            )}

            <div className="flex items-end gap-2 flex-wrap">
              <span>{message.content}</span>
              <span className="text-[10px] text-gray-500 whitespace-nowrap">
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 📤 Sent (Right side) */}
      {isMine && (
        <div className="flex justify-end max-w-[75%]">
          <div
            className={`relative px-3 py-2 shadow-sm break-words inline-flex flex-col bg-blue-500 text-white
              ${
                isSameSenderPrev(messages, message, index)
                  ? "rounded-2xl"
                  : "rounded-2xl rounded-tr-none"
              }`}
          >
            {!isSameSenderPrev(messages, message, index) && (
              <span
                className="absolute top-0 right-[-8px] w-0 h-0 
                border-b-[10px] border-t-transparent 
                border-l-[10px] border-l-blue-500 
                border-t-[0px] border-b-transparent"
              />
            )}

            <div className="flex items-end gap-2 flex-wrap">
              <span>{message.content}</span>
              <span className="text-[10px] text-gray-200 whitespace-nowrap">
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ✍️ Typing indicator bubble */}
      {message.isTyping && !isMine && (
        <div className="flex items-start gap-2 max-w-[75%]">
          {/* 👤 Avatar always visible in group typing */}
          {isGroup && (
            <img
              src={message.sender.pic}
              alt={message.sender.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          )}

          <div className="px-3 py-2 bg-gray-200 rounded-2xl text-gray-600 text-sm">
            typing...
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;