// const { use } = require("react");
const userModel = require("../models/user.model");
const tokenBlackListModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, username) => {
  console.log("ID: ", id, "USERNAME: ", username);
  const token = jwt.sign(
    { id: id, username: username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  return token;
};

/**
 * @route POST /auth/api/v1/register
 * @description Register a New user
 * @access Public
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please enter all the details",
      });
    }

    const userExists = await userModel.findOne({
      $or: [{ email }, { userName: username }],
    });

    if (userExists) {
      return res.status(400).json({
        message:
          "Account is already registered with the same Email or Username",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      userName: username,
      email,
      password: hashPassword,
    });

    console.log("User is created", user);

    const token = generateToken(user._id, user.userName);

    console.log("Token generated");

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("ERROR: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/**
 *
 * @param {username, email, password} req
 * @param {*} res
 */
async function login(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please enter all the details",
      });
    }

    const user = await userModel.findOne({
      $or: [{ email }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or username",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Please enter valid password",
      });
    }

    const token = generateToken(user._id, user.userName);
    console.log("TOKENNNN:", token);
    res.cookie("token", token);
    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.userName,
      },
    });
  } catch (error) {
    console.log("ERROR: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.token;
    console.log("Token in Logout:", token);
    if (!token) {
      return res.status(400).json({
        message: "No token found",
      });
    }
    console.log("Token Found:", token);
    const blackListToken = await tokenBlackListModel.create({
      token: token,
    });
    console.log("Token Black Listed");
    res.clearCookie("token");
    console.log("Cookie cleared");
    return res.status(200).json({
      message: "Logout Successful",
      blackListToken,
    });
  } catch (error) {}
}

module.exports = {
  register,
  login,
  logout,
};
