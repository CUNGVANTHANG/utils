const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.use(express.json());

app.post("/send", (req, res) => {
  const message = req.body.message;
  console.log("Received message:", message);
  io.emit("pushNotification", {
    message,
  });
  res.status(200).send({ message: "Sent successfully" });
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
