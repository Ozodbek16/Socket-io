const socket = io();

const form = document.querySelector("form");
const chatMsg = document.querySelector(".chat__message");
const chat = document.querySelector(".chat__messages");
const roomName = document.querySelector("#room_name");
const ul = document.querySelector("#users");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("message", chatMsg.value);
  chatMsg.value = "";
});

socket.on("message", (msg) => {
  forMsg(msg);
});

socket.on("bot", (data) => {
  forBot(data);
});

socket.on("roomname", (room) => {
  roomName.innerHTML = room;
});

socket.on("users", (data) => {
  for (let i = 0; i < data.users.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = data.users[i].name;
    ul.append(li);
  }
});

function forMsg(msg) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${msg.username}</strong>  ${msg.msg}`;
  chat.append(p);
}

function forBot(data) {
  const p = document.createElement("p");
  p.innerHTML = `${data.username} ${data.msg}              ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
  chat.append(p);
}
