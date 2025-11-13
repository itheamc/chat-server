// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for demo
    methods: ["GET", "POST"]
  }
});

// In-memory storage for connected users
const connectedUsers = new Map();

// Serve a simple message for root
app.get("/", (req, res) => {
  res.send("Socket.IO Chat Server is running 🚀");
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  // Receive user details
  socket.on("user_detail", (data) => {
    try {
      const userDetail = JSON.parse(data);
      connectedUsers.set(socket.id, userDetail);
      console.log("👤 User detail saved:", userDetail);
      console.log("📊 Total connected users:", connectedUsers.size);
    } catch (error) {
      console.error("❌ Error parsing user detail:", error);
    }
  });

  // Receive message from client
  socket.on("chat_message", (msg) => {
    const userDetail = connectedUsers.get(socket.id);
    
    // Create message object with user details
    const messageData = {
      message: msg,
      user: userDetail || { id: socket.id, name: "Anonymous" },
      timestamp: new Date().toISOString()
    };
    
    console.log("💬 Message from", userDetail?.name || "Anonymous", ":", msg);
    
    // Broadcast to all connected clients (including sender)
    io.emit("chat_message", messageData);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    const userDetail = connectedUsers.get(socket.id);
    console.log("🔴 User disconnected:", userDetail?.name || socket.id);
    
    // Remove user from connected users list
    connectedUsers.delete(socket.id);
    console.log("📊 Total connected users:", connectedUsers.size);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});