import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: "./uploads/task_submission",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploads = multer({ storage: storage });

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

router.post(
  "/task/submit/:taskId",
  uploads.single("file"),
  async (req, res, next) => {
    const taskId = req.params.taskId;
    const { text } = req.body;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        res.status(401).json({ message: "Task not found" });
      }
      task.submission = {
        text: text,
        file_name: req.file.originalname,
        file_path: req.file.path,
        submitted_at: Date.now(),
      };
      await task.save();
      return res.status(201).json({
        message:
          "Your task submitted successfully. Please wait for further approval.",
      });
    } catch (error) {
      next(error);
    }
  }
);

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

router.get("/task/:taskId/download", async (req, res, next) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);
    res.download(task.submission.file_path);
  } catch (error) {
    next(error);
  }
});

export default router;
