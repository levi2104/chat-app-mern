// Chatpage.jsx

import MyChats from "../components/MyChats";
import Header from "../components/Header";
import ChatBox from "../components/ChatBox/ChatBox";

const Chatpage = () => {
  return (
    <div className="w-full">
      <Header />

      <div className="flex p-3 h-[87vh]">
        <MyChats />
        <ChatBox />
      </div>
    </div>
  );
};

export default Chatpage;
