const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth");

router.get("/github", authController.githubLogin);
router.get("/github/callback", authController.githubCallback);
router.post("/exchange", authController.exchangeCode);
router.get("/verify", authenticateToken, authController.verifyToken);
router.post("/logout", authController.logout);
router.get("/user", authController.getUser);

module.exports = router;
