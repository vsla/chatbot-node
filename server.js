const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

let messages = [];

io.on("connection", (socket) => {
  console.log("socket connectado", socket.id);

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (rawData) => {
    const now = new Date

    const data = {...rawData, createdAt: now}
    messages.push(data);

    socket.emit("receivedMessage", data);
    socket.broadcast.emit("receivedMessage", data);
  });
});

server.listen(3000, () => {
  console.log("ouvindo na porta 3000");
});
