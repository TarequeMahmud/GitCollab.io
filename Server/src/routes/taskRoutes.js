import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router.get("/", async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const response = await Project.findById(projectId);
    if (!response) {
      return res.status(404).json({
        message: "No Project Found.",
      });
    }
    const tasks = response.tasks;
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        message: "No task created yet.",
      });
    }
    const tasksArray = await Promise.all(
      tasks.map((task) => Task.findById(task.task_id))
    );

    return res.status(200).json(tasksArray);
  } catch (error) {
    next(error);
  }
});

router.get("/:taskId", async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (task) {
      return res.status(200).json(task);
    } else {
      return res.status(404).json({
        message: "No task found in the database",
      });
    }
  } catch (error) {
    return next(error);
  }
});

//Task submission path
router.post("/:taskId", async (req, res, next) => {
  const { taskId } = req.params;
  const { _id, role } = req.user;
  const { submissionText, submissionFile } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "No task found in the database",
      });
    }

    if (task.assigned_to._id.toString() !== _id) {
      return res.status(401).json({
        message:
          "You are not authorized to submit this this task. If you think there is an error, please contact admin.",
      });
    }
    task.submission = {
      text: submissionText,
      file: submissionFile,
    };
    await task.save();
    return res.status(201).json({
      message: "Task submitted successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const projectId = req.params.projectId;
  const { title, description, deadline, user_id, status, priority } = req.body;
  //Fetch the id of creator from parameters
  const creator = req.user._id;

  //verify the creator, if it is valid account.
  const projectInfo = await Project.findById(projectId);
  if (!projectInfo) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  const assineeInfo = await User.findById(user_id).select("name username");
  if (!assineeInfo) {
    return res.status(404).json({
      message: "User is not found",
    });
  }

  const isAdmin = projectInfo.people.some(
    (person) =>
      person.user_id.toString() === creator.toString() &&
      person.role === "admin"
  );
  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "Unauthorized: Only admin can assign a task" });
  }

  if (!title) return res.status(400).json({ message: "Insert a Name" });

  try {
    const newTask = new Task({
      title,
      description,
      deadline,
      project: { project_id: projectId, project_title: projectInfo.title },
      assigned_to: {
        _id: user_id,
        name: assineeInfo.name,
        username: assineeInfo.username,
      },
      status: status || "to-do",
      priority: priority || "medium",
    });
    const saveTask = await newTask.save();
    projectInfo.tasks.push({ task_id: saveTask._id });
    await projectInfo.save();

    return res.status(201).json({
      message: "Task created successfully",
      task: saveTask,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
