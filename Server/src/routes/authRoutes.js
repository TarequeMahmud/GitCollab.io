import express from "express";
import passport from "../config/passportConfig.js"; // Import passport config
import User from "../models/User.js"; // Adjust path if needed
import bcrypt from "bcrypt";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server error", error });
  }
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Server error", loggedIn: false, error: err });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Unauthorized" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Login failed", loggedIn: false, error: err });
      }
      return res
        .status(200)
        .json({
          message: "Logged in successfully",
          loggedIn: true,
          user: req.user,
        });
    });
  })(req, res, next);
});
export default router;
