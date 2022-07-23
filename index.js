const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const usersSchema = require("./model/user");

// midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//routing
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//socket.io
io.on("connect", (socket) => {
  console.log("New ws connected...");

  socket.on("join", async (data) => {
    socket.join(data.room);
    const findUser = await usersSchema.find({ name: data.username });
    if (findUser.length != 0) {
      data.username = data.username + Math.floor(Math.random() * 1000000);
    }

    const users = new usersSchema({
      name: await data.username,
      room: await data.room,
      socketId: await socket.id,
    });

    await users.save();
    socket.emit("roomname", data.room);
    const user = await usersSchema.findOne({ socketId: socket.id });

    socket.broadcast.to(data.room).emit("bot", {
      username: data.username,
      msg: "joined the chat chat",
    });

    io.to(data.room).emit("bot", {
      username: data.username,
      msg: "welcome to the chat",
    });

    io.emit("users", {
      users: await usersSchema.find({ room: data.room }),
    });

    socket.on("message", (msg) => {
      io.to(data.room).emit("message", { username: data.username, msg });
    });
  });

  socket.on("disconnect", async () => {
    const user = await usersSchema.findOne({ socketId: socket.id });
    io.emit("bot", { username: user.name, msg: "left the chat" });
    await usersSchema.findByIdAndDelete(user._id);
  });
});

require("./helper/db")();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server working on port 3000");
});
 