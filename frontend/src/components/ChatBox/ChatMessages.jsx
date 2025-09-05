import MessageBubble from "./MessageBubble";
import DateDivider from "./DateDivider";

/* eslint-disable react/prop-types */
const TypingDots = ({ sender, isGroup }) => {
  return (
    <div className="flex w-full mb-1 justify-start">
      <div className="flex items-end gap-2 max-w-[75%]">
        {/* 👤 Avatar only in group chats */}
        {isGroup && (
          <img
            src={sender?.pic || "/default-avatar.png"}
            alt="Typing User"
            className="w-7 h-7 rounded-full object-cover"
          />
        )}

        {/* Bubble */}
        <div className="relative px-3 py-2 h-8 shadow-sm break-words inline-flex items-center gap-1 bg-white text-black rounded-2xl rounded-tl-none">
          {/* Tail */}
          <span
            className="absolute top-0 left-[-8px] w-0 h-0 
              border-b-[10px] border-t-transparent 
              border-r-[10px] border-r-white 
              border-t-[0px] border-b-transparent"
          />

          {/* Animated dots */}
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></span>
        </div>
      </div>
    </div>
  );
};

const ChatMessages = ({
  messages,
  user,
  selectedChat,
  messagesEndRef,
  typingUser,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-200 flex-1 rounded-[5px] overflow-y-auto p-3">
      <div className="flex flex-col justify-end min-h-full space-y-[.01px]">
        {messages.map((m, i) => {
          const currDate = formatDate(m.createdAt);
          const prevDate = i > 0 ? formatDate(messages[i - 1].createdAt) : null;
          const showDateDivider = currDate !== prevDate;

          return (
            <div key={m._id}>
              {showDateDivider && <DateDivider date={currDate} />}
              <MessageBubble
                message={m}
                user={user}
                selectedChat={selectedChat}
                messages={messages}
                index={i}
              />
            </div>
          );
        })}

        {/* 🔹 Typing dots appear as an incoming bubble */}
        {typingUser && (
          <TypingDots isGroup={selectedChat.isGroupChat} sender={typingUser} />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;