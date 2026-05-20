const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: [true, "This user name has already taken"],
    require: true,
  },
  email: {
    type: String,
    unique: [true, "This email is registered already"],
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
