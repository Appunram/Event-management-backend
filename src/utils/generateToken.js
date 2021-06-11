const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const generateToken = async (id) => {
    try {
        accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY_TIME, })
        return accessToken
    } catch (error) {
        console.error(error);
        return;
    }
};

const generateRefreshToken = async (id) => {
    try {
        let refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
        await new Token({ refreshToken }).save();
        return refreshToken;
    } catch (error) {
        console.error(error);
        return;
    }
}

module.exports = { generateToken, generateRefreshToken };