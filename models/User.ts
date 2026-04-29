import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  password: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);