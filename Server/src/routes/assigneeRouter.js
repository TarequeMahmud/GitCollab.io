import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

//Get task for the assignee
router.get("/tasks", async (req, res, next) => {
  const { _id } = req.user;

  try {
    const tasks = await Task.find({ "assigned_to._id": _id });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        message: "No task you have been assigned yet",
      });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

export default router;
