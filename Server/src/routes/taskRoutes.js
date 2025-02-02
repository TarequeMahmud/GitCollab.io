import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import Task from "../models/Task.js";

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

    return res.json(tasksArray);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, description, project_id, assigned_to, status, priority } =
    req.body;
  //Fetch the id of creator from parameters
  const creator = req.user._id;
  console.log(req.body);
  //verify the creator, if it is valid account.
  const projectInfo = await Project.findById(project_id);
  if (!projectInfo) {
    return res.status(404).json({
      message: "Project not found",
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

  if (!name) return res.status(400).json({ message: "Insert a Name" });

  try {
    const newTask = new Task({
      name,
      description,
      project_id,
      assigned_to,
      status: status || "to-do",
      priority: priority || "medium",
    });
    const saveTask = await newTask.save();
    projectInfo.tasks.push({ task_id: saveTask._id });
    const updateTaskInfo = await projectInfo.save();

    return res.status(201).json({
      message: "Task created successfully",
      project: saveTask.people,
      projectsList: updateTaskInfo.tasks,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
