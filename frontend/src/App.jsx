import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";


const App = () => {
  return (
    <div className="regular-fonts min-h-screen flex bg-[url('./background.png')] bg-cover bg-center">
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/chats' element={<ChatsPage />}/>
      </Routes>
    </div>
  );
};

export default App;
