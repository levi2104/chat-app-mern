import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { IoMdEye, IoMdEyeOff } from "react-icons/io"; // 👈 import eye icons
import { BsFileEarmarkImage } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pic, setPic] = useState(null);
  const [uploading, setUploading] = useState(false); // 👈 new state for image upload
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const postDetails = (pics) => {
    if (
      pics &&
      (pics.type === "image/jpeg" ||
        pics.type === "image/png" ||
        pics.type === "image/jpg")
    ) {
      setUploading(true); // show spinner while uploading
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app-mern");
      data.append("cloud_name", "dki6ruzuc");

      fetch("https://api.cloudinary.com/v1_1/dki6ruzuc/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url.toString());
          setUploading(false);
          showToast("Image uploaded successfully", "success");
        })
        .catch(() => {
          setUploading(false);
          showToast("Image upload failed", "error");
        });
    } else {
      showToast("Invalid image type", "error");
    }
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill all the fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
        pic,
      });

      showToast("Registration successful", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      showToast(
        error.response?.data?.message || error.message || "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-6 relative">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="bold-fonts">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
          className="bg-gray-100 px-4 py-2 outline-none rounded-full placeholder:text-[#bfc3c7]"
        />
      </div>

      {/* Email */}
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

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="bold-fonts">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="12345678"
            className="bg-gray-100 w-full px-4 py-2 outline-none rounded-full placeholder:text-[#bfc3c7]"
          />
          <div className="absolute right-3 top-[9px]">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <IoMdEye size={22} /> : <IoMdEyeOff size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <label className="bold-fonts">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="12345678"
            className="bg-gray-100 w-full px-4 py-2 outline-none rounded-full placeholder:text-[#bfc3c7]"
          />
          <div className="absolute right-3 top-[9px]">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <IoMdEye size={22} />
              ) : (
                <IoMdEyeOff size={22} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Picture */}
      <div className="flex flex-col gap-2">
        <label className="bold-fonts">Upload your Profile Picture</label>

        <label className="w-full">
          <input
            type="file"
            accept="image/*"
            required
            disabled={uploading}
            onChange={(e) => postDetails(e.target.files[0])}
            className="hidden"
            id="fileInput"
          />
          <span
            htmlFor="fileInput"
            className={`flex justify-center items-center gap-3 w-full h-10 text-center bg-gray-100 px-4 py-2 rounded-full border border-dashed transition duration-300 ease-in-out 
              ${
                uploading
                  ? "cursor-not-allowed bg-gray-200"
                  : "cursor-pointer hover:bg-gray-200"
              }
            `}
          >
            {uploading ? (
              <div className="h-4 w-4 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
            ) : (
              <>
                Choose File
                <BsFileEarmarkImage size={18} />
              </>
            )}
          </span>
        </label>

        {/* Show uploaded image preview */}
        {pic && !uploading && (
          <div className="mt-3 flex justify-center">
            <div className="relative">
              <img
                src={pic}
                alt="Uploaded preview"
                className="h-20 w-20 rounded-full object-cover border border-solid border-black "
              />
              <button
                type="button"
                onClick={() => setPic(null)}
                className="absolute top-[5px] right-[4px] bg-white border rounded-full p-[.5px] shadow hover:bg-red-500 hover:border-red-500 hover:text-white cursor-pointer transition duration-300 ease-in-out"
              >
                <IoClose size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Signup Button */}
      <button
        type="submit"
        disabled={loading}
        className={`my-3 h-10 w-full rounded-full flex justify-center items-center hover:text-white hover:bg-blue-500 hover:border-blue-500 text-blue-700 border border-blue-700 transition duration-300 ease-in-out ${
          loading
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default Signup;