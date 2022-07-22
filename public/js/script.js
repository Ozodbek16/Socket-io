const socket = io();
// function disableF5(e) {
//   if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82)
//     e.preventDefault();
// }

// $(document).ready(function () {
//   $(document).on("keydown", disableF5);
// });

const form = document.querySelector("form");
const chatMsg = document.querySelector(".chat__message");
const chat = document.querySelector(".chat__messages");
const roomName = document.querySelector("#room_name");
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

function forMsg(msg) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${msg.username}</strong>  ${msg.msg}`;
  chat.append(p);
}

function forBot(data) {
  const p = document.createElement("p");
  p.innerHTML = `${data.username} ${data.msg}`;
  chat.append(p);
}
