const Complaint = require("../models/Complaint");

// Create complaint (student)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || "low",
      user: req.user.id, // from token
    });

    res.status(201).json({
      message: "Complaint created",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//  Get logged-in user's complaints (student)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//  Get all complaints (staff/supervisor/admin)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate(
      "user",
      "name email"
    );

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update complaint status (staff/supervisor)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // validate status
    const validStatuses = ["open", "in-progress", "resolved", "escalated"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // update status
    complaint.status = status || complaint.status;

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Assign complaint (admin/supervisor)
const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assignedTo = assignedTo;

    await complaint.save();

    res.status(200).json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get assigned complaints (staff/supervisor)
const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user.id }).populate(
      "user",
      "name email"
    );

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get complaint summary (admin/supervisor)
const getSummary = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const open = await Complaint.countDocuments({ status: "open" });
    const inProgress = await Complaint.countDocuments({ status: "in-progress" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const escalated = await Complaint.countDocuments({ status: "escalated" });

    res.status(200).json({
      total,
      open,
      inProgress,
      resolved,
      escalated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Get escalated complaints
const getEscalatedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: "escalated" }).populate(
      "user",
      "name email"
    );

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔥 EXPORT ALL FUNCTIONS
module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  getAssignedComplaints,
  getSummary,
  getEscalatedComplaints,
};

