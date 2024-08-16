import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Setting", settingsSchema);

export default Settings;
