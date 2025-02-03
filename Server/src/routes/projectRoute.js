import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

/*This Section is for admin*/

router.get("/", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const response = await User.findById(userId).select("projects");

    if (!response) {
      return res.status(401).json({
        loggedIn: false,
        message: "You must have an account to create a project!",
      });
    }
    const projects = response.projects;
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        loggedIn: true,
        message: "No projects created yet.",
      });
    }
    const projectsArray = await Promise.all(
      projects.map((project) => Project.findById(project.project_id))
    );

    return res.json(projectsArray);
  } catch (error) {
    next(error);
  }
});

router.get("/:projectId", async (req, res, next) => {
  const { userId, projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    const isEnrolledUser = project.people.some(
      (person) => person.user_id.toString() === userId
    );
    if (isEnrolledUser) {
      return res.status(200).json(project);
    } else {
      return res.status(404).json({
        message: "No project found",
      });
    }
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  //Fetch the id of creator from parameters
  const creator = req.params.userId;

  //verify the creator, if it is valid account.
  const creatorInfo = await User.findById(creator);
  if (!creatorInfo) {
    return res.status(401).json({
      loggedIn: false,
      message: "You must have an account to create a project!",
    });
  }

  const { name, description, deadline } = req.body;
  if (!name) return res.status(400).json({ message: "Insert a Name" });

  try {
    const newProject = new Project({
      name,
      description,
      deadline,
      people: [
        { user_id: creatorInfo._id, name: creatorInfo.name, role: "admin" },
      ],
      created_by: creatorInfo._id,
    });
    const saveProject = await newProject.save();
    creatorInfo.projects.push({ project_id: saveProject._id, role: "admin" });
    const updateCreatorInfo = await creatorInfo.save();

    return res.status(201).json({
      message: "Project created successfully",
      project: saveProject.people,
      projectsList: updateCreatorInfo.projects,
    });
  } catch (error) {
    next(error);
  }
});

//user routes for admin
router.post("/:projectId/users", async (req, res, next) => {
  const creator = req.user._id;
  const { username, role } = req.body;
  const projectId = req.params.projectId;

  try {
    if (!username || !role) {
      return res.status(400).json({
        message: "Username and role are required.",
      });
    }
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log(user);

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    //if user exists in the people list:
    const isExist = project.people.some(
      (person) => person?.user_id?.toString() === user._id?.toString()
    );
    if (isExist)
      return res
        .status(409)
        .json({ message: "User already exists in this project." });
    //verify if admin
    const isAdmin = project.people.some(
      (person) =>
        person.user_id.toString() === creator.toString() &&
        person.role === "admin"
    );
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admin can assign a task" });
    }

    //update project
    project.people.push({ user_id: user._id, name: user.name, role: role });
    const updateProjectInfo = await project.save();
    if (!updateProjectInfo) {
      return res.json("not updated");
    }
    res.status(201).json({ people: updateProjectInfo.people });
  } catch (error) {
    next(error);
  }
});

export default router;
