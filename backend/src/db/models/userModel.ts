import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
