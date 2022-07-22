const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
  },
  room: {
    type: String,
  },
  socketId: {
    type: String,
  },
});

module.exports = model("users", userSchema);