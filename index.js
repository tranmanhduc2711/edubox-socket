import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:3000", "http://localhost:3000", "*"],
    credentials: false,
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connect`);
  socket.on("reconnect", () => {
    console.log(`${socket.id} reconnect!`);
  });
  socket.on("disconnect", () => {
    console.log(`${socket.id} user disconnect!`);
  });
  socket.on("JOIN_GAME", (data) => {
    socket.join(data.presentCode);
  });
  socket.on("JOIN_GROUPS", (data) => {
    socket.join(data.groupCodes);
  });
  socket.on("START_GAME", (data) => {
    io.to(data.presentCode).emit("START_GAME", data);
  });
  socket.on("SEND_ANSWER", (data) => {
    io.to(data.presentCode).emit("RECEIVE_ANSWER", data);
  });
  socket.on("SEND_RESULT", (data) => {
    io.to(data.presentCode).emit("RECEIVE_RESULT", data);
  });
  socket.on("NEXT_SLIDE", (data) => {
    io.to(data.presentCode).emit("NEXT_SLIDE", data);
  });
  socket.on("SEND_MESSAGE", (data) => {
    io.to(data.presentCode).emit("RECEIVE_MESSAGE", data);
  });
  socket.on("NOTIFY_GROUP_GAME_START", (data) => {
    io.to(data.groupCode).emit("NOTIFY_GROUP_GAME_START", data);
  });
});

server.listen(5000, () => {
  console.log("listening on 5000");
});
