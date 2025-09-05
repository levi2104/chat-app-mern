import { Provider } from "./components/ui/provider";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/ChatProvider";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Provider>
        <ToastProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ToastProvider>
      </Provider>
    </BrowserRouter>
  </>
);
