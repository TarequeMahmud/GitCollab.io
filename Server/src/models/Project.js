import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, trim: true },
  deadline: { type: Date, default: Date.now },
  people: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
      role: {
        type: String,
        enum: ["admin", "manager", "member"],
      },
      _id: false,
    },
  ],
  tasks: [
    {
      task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
      _id: false,
    },
  ],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Project", projectSchema);
