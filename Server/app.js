// Importing dependencies
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import cors from "cors";
//import necessary routes
import mainRouter from "./src/routes/index.js";

//Import middlewares
import errorHandler from "./src/middlewares/errorHandler.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//using express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
app.use(passport.authenticate("session"));

// Middleware to parse JSON data
app.use(express.json());

//route setup

app.use("/", mainRouter);

//middleware setup
app.use(errorHandler);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
