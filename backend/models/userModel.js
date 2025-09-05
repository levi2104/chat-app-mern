import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default: "http://localhost:3000/uploads/anonymous-avatar.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema)

export default User