const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasks.controller");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// User tasks
router.get("/user", tasksController.getUserTasks);
router.get("/projects", tasksController.getProjectTasks);

// CRUD operations
router.post("/", tasksController.createTask);
router.get("/:id", tasksController.getTask);
router.put("/:id", tasksController.updateTask);
router.delete("/:id", tasksController.deleteTask);

// GitHub integration
router.post("/from-github", tasksController.createTaskFromGitHubIssue);
router.post("/:id/link-github", tasksController.linkTaskToGitHubIssue);
router.post("/:id/github", tasksController.linkToGitHubIssue);

module.exports = router;
