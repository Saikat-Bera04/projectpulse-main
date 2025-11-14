const express = require("express");
const router = express.Router();
const { getGitHubRepositories, getGitHubIssues, createGitHubIssue, updateGitHubIssue } = require("../utils/github");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get user's repositories
router.get("/repositories", async (req, res) => {
    try {
        const repositories = await getGitHubRepositories(req.token);
        res.json(repositories);
    } catch (error) {
        console.error("Error fetching repositories:", error.message);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
});

// Get repository details
router.get("/repositories/:owner/:repo", async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${req.token}`,
                "User-Agent": "ProjectPulse-App",
                Accept: "application/vnd.github.v3+json"
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching repository:", error.message);
        res.status(500).json({ error: "Failed to fetch repository" });
    }
});

// Get user's issues
router.get("/issues", async (req, res) => {
    try {
        const issues = await getGitHubIssues(req.token);
        res.json(issues);
    } catch (error) {
        console.error("Error fetching issues:", error.message);
        res.status(500).json({ error: "Failed to fetch issues" });
    }
});

// Create new GitHub issue
router.post("/issues", async (req, res) => {
    try {
        const { repository, title, body, labels } = req.body;
        const issue = await createGitHubIssue(req.token, repository, title, body, labels);
        res.status(201).json(issue);
    } catch (error) {
        console.error("Error creating issue:", error.message);
        res.status(500).json({ error: "Failed to create issue" });
    }
});

// Update GitHub issue
router.put("/issues/:number", async (req, res) => {
    try {
        const { repository, title, body, state, labels } = req.body;
        const issue = await updateGitHubIssue(req.token, repository, req.params.number, {
            title, body, state, labels
        });
        res.json(issue);
    } catch (error) {
        console.error("Error updating issue:", error.message);
        res.status(500).json({ error: "Failed to update issue" });
    }
});

module.exports = router;
