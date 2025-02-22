import express from "express";
import taskRouter from "./taskRoutes.js";
import authRouter from "./authRoutes.js";
import projectRouter from "./projectRoutes.js";
import assigneeRouter from "./assigneeRouter.js";

const router = express.Router();

// Task routes under a specific project
router.use("/", authRouter);
router.use("/project/", projectRouter);
router.use("/project/:projectId/task", taskRouter);
router.use("/assignee", assigneeRouter);

export default router;
