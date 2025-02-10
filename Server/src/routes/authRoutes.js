import express from "express";
import passport from "../config/passportConfig.js"; // Import passport config
import User from "../models/User.js"; // Adjust path if needed
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", (req, res, next) => {
  return res.json("Please Login");
});

router.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ loggedIn: true });
  } else {
    return res.status(401).json({ message: "You are currently unauthorized." });
  }
});

// Register Route
router.post("/register", async (req, res, next) => {
  const { name, username, email, password, about } = req.body;
  console.log(req.body);

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      message:
        "Incomplete request. At least Name, Username, Email and Password are needed.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername) {
      return res.status(409).json({ message: "Duplicate username" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      about,
    });
    await newUser.save();

    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ message: "User registered successfully" });
    });
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
        return next(err);
      }
      return res.status(200).json({
        message: "Logged in successfully",
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
