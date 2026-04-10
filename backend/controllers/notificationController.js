const Notification = require("../models/Notification");

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private (all logged-in users)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    
    // Map to include 'read: false' defaulting for frontend UI logic
    const mappedNotifications = notifications.map(n => ({
      _id: n._id,
      message: n.message,
      target: n.target,
      type: n.type,
      createdAt: n.createdAt,
      read: false // Frontend manages local read state per session
    }));

    res.status(200).json(mappedNotifications);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private (Admin only)
const createNotification = async (req, res) => {
  try {
    const { message, target, type } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const notification = await Notification.create({
      message,
      target: target || 'all',
      type: type || 'info',
      sender: req.user.id
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification: ", error);
    res.status(500).json({ message: "Server error creating notification" });
  }
};

module.exports = {
  getNotifications,
  createNotification
};
