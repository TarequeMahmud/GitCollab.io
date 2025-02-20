import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, trim: true },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  deadline: { type: Date, required: true },
  assigned_to: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  status: { type: String, enum: ["to-do", "in-progress", "completed"] },
  priority: { type: String, enum: ["high", "medium", "low"] },

  comments: [
    {
      comment: { type: String },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      time_stamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Task", taskSchema);
