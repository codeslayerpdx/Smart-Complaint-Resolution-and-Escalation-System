const Complaint = require("../models/Complaint");
const { sendResolutionEmail } = require("../utils/emailService");


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
    
    // Normalize status for comparison
    const normalizedStatus = status ? status.toLowerCase() : null;

    // validate status
    const validStatuses = ["open", "in-progress", "resolved", "escalated"];
    if (normalizedStatus && !validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id).populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const previousStatus = complaint.status;
    
    // update status
    complaint.status = normalizedStatus || complaint.status;

    await complaint.save();

    // Trigger email notification if status changed to 'resolved'
    if (normalizedStatus === "resolved" && previousStatus !== "resolved") {
      console.log(`Triggering resolution email for complaint: ${complaint.title}`);
      const resolvedAt = new Date().toLocaleString();
      
      // Asynchronous call (don't wait for email to send to return response)
      sendResolutionEmail(
        complaint.user.email,
        complaint.user.name,
        complaint.title,
        resolvedAt
      ).catch(err => console.error("Email service error:", err.message));
    } else {
      console.log(`No email sent. Status: ${normalizedStatus}, Previous: ${previousStatus}`);
    }

    res.status(200).json({
      message: "Complaint updated",
      complaint,
    });
  } catch (error) {
    console.error("Update status error:", error.message);
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

