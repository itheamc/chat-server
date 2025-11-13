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

// Serve a simple message for root
app.get("/", (req, res) => {
  res.send("Socket.IO Chat Server is running 🚀");
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  // Receive message from client
  socket.on("chat_message", (msg) => {
    console.log("💬 Message:", msg);
    // Broadcast to all connected clients
    io.emit("chat_message", msg);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

