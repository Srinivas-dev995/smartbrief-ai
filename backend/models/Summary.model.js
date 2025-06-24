import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      trim: true,
    },
    inputText: {
      type: String,
      required: true,
    },
    summaryText: {
      type: String,
    },
    // promptUsed: { type: String },
    wordCount: { type: Number },
    regenarated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Summary = mongoose.model("Summary", SummarySchema);
