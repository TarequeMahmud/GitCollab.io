import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  people: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: String,
        enum: ["admin", "manager", "member"],
      },
    },
  ],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Project", projectSchema);
