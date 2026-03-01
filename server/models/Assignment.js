const mongoose = require("mongoose");
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  relatedTables: {
    type: [String],
    default: [],
  },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
