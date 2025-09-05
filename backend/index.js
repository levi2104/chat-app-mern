import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import { errorHandlder, notFound } from "./middlewares/errorMiddlewares.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notifications", notificationRoutes);


// Error middlewares
app.use(notFound);
app.use(errorHandlder);

const PORT = process.env.PORT || 3000;

// 🔹 Create HTTP server
const server = createServer(app);

// 🔹 Attach Socket.IO
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // frontend URL (change if needed)
  },
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // setup user room (for personal notifications)
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // send and receive messages
  socket.on("new message", (messageData) => {
    const chat = messageData.chat;
    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == messageData.sender._id) return; // skip sender
      socket.in(user._id).emit("message received", messageData);
    });
  });

  // typing
  socket.on("typing", (room, user) => {
    socket.in(room).emit("typing", user); // ✅ send user info
  });

  // stop typing
  socket.on("stop typing", (room, user) => {
    socket.in(room).emit("stop typing", user);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);