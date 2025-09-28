import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String },
  projects: [
    {
      project_id: { type: mongoose.Schema.Types.ObjectId },
      role: {
        type: String,
        enum: ["admin", "manager", "member"],
      },
      _id: false,
    },
  ],
});

export default mongoose.model("User", userSchema);
