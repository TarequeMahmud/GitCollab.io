import express from "express";
import Project from "../models/Project.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

/*This Section is for admin*/

router.get("/", async (req, res, next) => {
  const userId = req.user._id;
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
      return res.notFound("No projects created yet");
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
  const userId = req.user._id;
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    const isEnrolledUser = project.people.some(
      (person) => person.user_id.toString() === userId.toString()
    );
    if (isEnrolledUser) {
      const user = project.people.find(
        (person) => person.user_id.toString() === userId.toString()
      );

      res.success({
        ...project.toObject(),
        current_user: { _id: user.user_id, role: user.role },
      });
    } else {
      return res.notFound("No project found");
    }
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  //Fetch the id of creator from parameters
  const creator = req.user._id;

  //verify the creator, if it is valid account.
  const creatorInfo = await User.findById(creator);
  if (!creatorInfo) {
    return res.status(401).json({
      message: "You must have an account to create a project!",
    });
  }

  const { title, description, deadline } = req.body;
  if (!title || !deadline)
    return res.status(400).json({ message: "Please insert required fields" });

  try {
    const newProject = new Project({
      title,
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

    return res.success(201, "Project created successfully");
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

    if (!user) res.notFound("User not found");

    const project = await Project.findById(projectId);
    if (!project) res.notFound("Project not found");

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
    res.success(201, { people: updateProjectInfo.people });
  } catch (error) {
    next(error);
  }
});

router.delete("/:projectId/users/:userId", async (req, res, next) => {
  const { projectId, userId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) res.notFound("Project is not found");
    const isEnrolledUser = project.people.some(
      (person) => person.user_id.toString() === userId.toString()
    );
    if (isEnrolledUser) {
      const removedUserArray = project.people.filter(
        (person) => person.user_id.toString() !== userId.toString()
      );
      project.people = removedUserArray;
      await project.save();
      res.success(removedUserArray);
    } else {
      return res.notFound("User is not found in the project.");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:projectId/users/:userId", (req, res, next) => {});

router.get("/:projectId/role", async (req, res, next) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;
  try {
    const project = await Project.findById(projectId);
    if (!project) res.notFound("Project is not found");
    const user = project.people.filter(
      (person) => person.user_id.toString() === userId.toString()
    );
    res.sucess(user.role);
  } catch (error) {
    next(error);
  }
});

export default router;
