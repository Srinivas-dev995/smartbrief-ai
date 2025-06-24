import mongoose from "mongoose";

const FileUploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalFileName: String,
    filePath: String,
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    summaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Summary",
    },
  },
  { timestamps: true }
);

export const FileUpload = mongoose.model("FileUpload", FileUploadSchema);
