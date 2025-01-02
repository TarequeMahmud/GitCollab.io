import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import User from "../models/User.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/:id", async (req, res, next) => {});

router.post("/:id", async (req, res, next) => {
  const createdBy = req.params.id;

  const verifyCreator = await User.findById(createdBy);
  if (!verifyCreator) {
    return res
      .status(401)
      .json({ message: "You must have an account to create a project!" });
  }

  const { name, description, deadline, people, tasks } = req.body;
  if (!name) return res.status(400).json({ message: "Insert a Name" });
  try {
    const newProject = new Project({
      name,
      description,
      deadline,
      people,
      tasks,
      created_by: createdBy,
    });
    await newProject.save();
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
