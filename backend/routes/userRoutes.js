const express = require("express");
const router = express.Router();
const { getAssignableUsers } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Only admin and supervisor can fetch assignable users (based on who can assign)
router.get(
  "/assignable",
  protect,
  authorizeRoles("admin", "supervisor"),
  getAssignableUsers
);

module.exports = router;
