const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")

async function authMiddleware(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message: "Toke Not Provided"
        })
    }

    const isTokenBlacklisted = await tokenBlackListModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        res.status(400).json({
            message: "Token is black listed"
        })
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(400).json({
            message: "Invalid token"
        })
    }
}

module.exports = { authMiddleware }