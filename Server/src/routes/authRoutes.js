import express from "express";
import passport from "../config/passportConfig.js"; // Import passport config
import User from "../models/User.js"; // Adjust path if needed
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", (req, res, next) => {
  return res.json("Please Login");
});

// Register Route
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      const authError = new Error(info?.message || "Invalid credentials");
      authError.statusCode = 401;
      return next(authError);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(error);
      }
      return res.status(200).json({
        message: "Logged in successfully",
        loggedIn: true,
        user: req.user,
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res
      .status(200)
      .json({ message: "Logged out successfully", loggedIn: false });
  });
});
export default router;
