import express from "express";
import passport from "../config/passportConfig.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/checkuser/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const userData = await User.findById(userId);
    if (!userData) return res.notFound("User not found");

    const { name, username, email, about } = userData;
    return res.success({
      name,
      username,
      email,
      about,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.success("authenticated");
  } else {
    return res.error(401, "You are currently unauthorized.");
  }
});

// Register Route
router.post("/register", async (req, res, next) => {
  const { name, username, email, password, about } = req.body;
  console.log(req.body);

  if (!name || !username || !email || !password) {
    return res.error(
      400,
      "Incomplete request. At least Name, Username, Email and Password are needed."
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.error(400, "User already exists");

    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername) return res.error(409, "Duplicate username");

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
      return res.success(201, "User registered successfully");
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
      return res.success("Logged in successfully");
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    return res.success("Logged out successfully");
  });
});

//manage cors
export default router;
