import mongoose from "mongoose";

const CreditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  change: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['recharge', 'summary', 'admin-adjustment'],
    required: true
  },
  description: String
}, { timestamps: true });

export const CreditLog = mongoose.model('CreditLog', CreditLogSchema);
