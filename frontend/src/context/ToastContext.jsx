/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useCallback } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoMdCloseCircleOutline } from "react-icons/io"; // error icon

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: "" }

  const showToast = useCallback((message, type) => {
    setToast({ type, message });

    // Auto-hide after 3s
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed inset-x-0 bottom-6 flex justify-center z-50">
          <div
            className={`px-5 py-3 rounded-[5px] shadow-lg flex items-center gap-3 animate-slide-up-fade ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {toast.type === "success" ? (
              <FaRegCircleCheck size={18} />
            ) : (
              <IoMdCloseCircleOutline size={20} />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};