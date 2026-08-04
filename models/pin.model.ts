import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    isUserLog: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

const PinModel =
  mongoose.models.Pin || mongoose.model("Pin", pinSchema);

export default PinModel;
