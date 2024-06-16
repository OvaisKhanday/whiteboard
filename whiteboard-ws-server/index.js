const express = require("express");
const app = express();

const PORT = 4000;

//New imports
const http = require("http").Server(app);
const cors = require("cors");
app.use(cors());

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("new_line", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_new_line", data);
  });

  socket.on("lines", (data) => {
    socket.broadcast.emit("receive_lines", data);
  });
  // socket.on("last_canvas", (data) => {
  //   socket.broadcast.emit("receive_last_canvas", data);
  // });

  socket.on("hello", (data) => {
    socket.broadcast.emit("hello", data);
  });
  socket.on("msg", (data) => {
    socket.broadcast.emit("msg", data);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("last_canvas", (data) => {
    socket.to(data.roomId).emit("receive_last_canvas", data.payload);
  });
  socket.on("mouse_move", (data) => {
    socket.to(data.roomId).emit("receive_mouse_move", data.payload);
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
