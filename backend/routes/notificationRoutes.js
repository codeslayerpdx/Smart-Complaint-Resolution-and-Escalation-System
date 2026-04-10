const express = require("express");
const router = express.Router();
const { getNotifications, createNotification } = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

console.log("getNotifications:", typeof getNotifications);
console.log("protect:", typeof protect);
console.log("authorizeRoles:", typeof authorizeRoles);

// All users can view notifications
router.get("/", protect, getNotifications);

// Only admins can send notifications
router.post("/", protect, authorizeRoles("admin"), createNotification);

module.exports = router;
