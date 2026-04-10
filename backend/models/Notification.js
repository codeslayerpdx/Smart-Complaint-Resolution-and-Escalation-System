const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      enum: ["all", "student", "staff"],
      default: "all",
    },
    type: {
      type: String,
      enum: ["info", "alert", "escalation"],
      default: "info",
    },
    // The author who sent it
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
