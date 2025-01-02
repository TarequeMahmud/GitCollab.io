import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", async (req, res, next) => {
  const { name, description, deadline, people, tasks, created_by } = req.body;
  if (!name || !created_by) return res.json("necessary field missed");
  try {
    const newProject = new Project({
      name,
      description,
      deadline,
      people,
      tasks,
      created_by,
    });
    await newProject.save();
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
