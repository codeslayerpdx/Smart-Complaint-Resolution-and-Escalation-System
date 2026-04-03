const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  getAssignedComplaints,
  getSummary,
  getEscalatedComplaints, } = require("../controllers/complaintController");



// Only student can create complaint
router.post("/", protect, authorizeRoles("student"), createComplaint);



//  Student views own complaints
router.get("/my", protect, authorizeRoles("student"), getMyComplaints);



//  Staff / Supervisor / Admin view all
router.get(
  "/",
  protect,
  authorizeRoles("staff", "supervisor", "admin"),
  getAllComplaints
);



//  Get assigned complaints
router.get(
  "/assigned",
  protect,
  authorizeRoles("staff", "supervisor"),
  getAssignedComplaints
);



//  Assign complaint
router.put(
  "/assign/:id",
  protect,
  authorizeRoles("admin", "supervisor"),
  assignComplaint
);



//  Update status
router.put(
  "/:id",
  protect,
  authorizeRoles("staff", "supervisor"),
  updateComplaintStatus
);

// Analytics
router.get(
  "/summary",
  protect,
  authorizeRoles("admin", "supervisor"),
  getSummary
);

// Escalated complaints
router.get(
  "/escalated",
  protect,
  authorizeRoles("admin", "supervisor"),
  getEscalatedComplaints
);



module.exports = router;