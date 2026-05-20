const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = Router();

/**
 * @route POST /auth/api/v1/register
 * @description Register a New user
 * @access Public
 */
authRouter.post("/register", authController.register);

/**
 * @route POST /auth/api/v1/login
 * @description Login a user
 * @access Public
 */
authRouter.post("/login", authController.login);

/**
 * @route GET /auth/api/v1/logout
 * @description Logout a user
 * @access Public
 */
authRouter.get("/logout", authController.logout);

module.exports = authRouter;
