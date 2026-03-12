const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../services/email.service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // store refresh token in DB
    await Token.create({
      userId: user._id,
      token: refreshToken,
    });

    res.json({
      accessToken,
      refreshToken,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Token required" });
  }

  const tokenDoc = await Token.findOne({ token: refreshToken });

  if (!tokenDoc) {
    return res.status(403).json({ message: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // delete old token
    await Token.deleteOne({ token: refreshToken });

    // save new token
    await Token.create({
      userId: user._id,
      token: newRefreshToken,
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = uuidv4();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "User registered. Please verify your email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    emailVerificationToken: token,
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  user.isVerified = true;
  user.emailVerificationToken = null;

  await user.save();

  res.json({
    message: "Email verified successfully",
  });
};
