const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    "mongodb+srv://Ozodbek16:q0w9e8r7@cluster0.yfxl3.mongodb.net/socket",
    () => {
      console.log("MongoDB connected");
    }
  );
};
