const mongoose = require("mongoose");
const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "error"],
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    rowCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Attempt = mongoose.model("Attempt", attemptSchema);
module.exports = Attempt;
