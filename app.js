const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

const users = {};

io.on("connection", (socket) => {
  socket.on('user-connected', (username) => {
    users[socket.id] = username;
    console.log(users)
    io.emit('user-connected', username);
  });

  socket.on('send-message', (msg) => {
    io.emit('send-message', msg);
  });

  socket.on('disconnect', () => {
    const username = users[socket.id]; // Get the username of the disconnected user
    if (username) {
      io.emit('user-disconnected', username); // Notify all users about the disconnection
      console.log(`${username} disconnected`);
      delete users[socket.id]; // Remove the user from the list
    }
  });
});

httpServer.listen(5000);