import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

//TODO: complete the logic to fetch project data.

router.get("/", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const response = await User.findById(userId).select("projects");
    console.log(response.projects);

    if (!response) {
      return res.status(401).json({
        loggedIn: false,
        message: "You must have an account to create a project!",
      });
    }

    if (!response.projects || response.projects.length === 0) {
      return res.status(404).json({
        loggedIn: true,
        message: "No projects created yet.",
      });
    }

    return res.json(response.projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ loggedIn: false, message: "Server error", error });
  }
});

router.post("/:id", async (req, res, next) => {
  //Fetch the id of creator from parameters
  const createdBy = req.params.id;

  //verify the creator, if it is valid account.
  const verifyCreator = await User.findById(createdBy);
  if (!verifyCreator) {
    return res.status(401).json({
      loggedIn: false,
      message: "You must have an account to create a project!",
    });
  }

  //
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
    const saveProject = await newProject.save();

    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ loggedIn: false, message: "Server error", error });
  }
});

export default router;
