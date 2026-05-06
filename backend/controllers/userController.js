const User = require("../models/user");

const getAssignableUsers = async (req, res) => {
  try {
    // Fetch users whose role is staff, supervisor, or admin
    const assignableUsers = await User.find({
      role: { $in: ["staff", "supervisor", "admin"] }
    }).select("_id name email role");

    res.status(200).json(assignableUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAssignableUsers };
