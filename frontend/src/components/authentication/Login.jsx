import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = ChatState();
  const { showToast } = useToast();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // ✅ prevent page reload on "Enter"
    if (e) e.preventDefault();

    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });

      showToast("Logged in successfully", "success");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/chats");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ use form so Enter works automatically
    <form onSubmit={handleLogin} className="flex flex-col gap-6 relative">
      {/* Email Input */}
      <div className="flex flex-col gap-2">
        <label className="bold-fonts">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="abc@example.com"
          className="bg-gray-100 px-4 py-2 outline-none rounded-full placeholder:text-[#bfc3c7]"
        />
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-2">
        <label className="bold-fonts">
          Password <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="12345678"
            className="w-full bg-gray-100 px-4 py-2 outline-none rounded-full placeholder:text-[#bfc3c7]"
          />

          <div className="absolute right-3 top-[9px] bold-fonts text-sm">
            <button
              type="button"
              className="cursor-pointer flex items-center justify-center"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? <IoMdEye size={22} /> : <IoMdEyeOff size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit" // ✅ important
        disabled={loading}
        className={`mt-3 h-10 w-full rounded-full flex justify-center items-center cursor-pointer text-blue-700 border border-blue-700 transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white hover:border-blue-500 ${
          loading && "bg-blue-500 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default Login;