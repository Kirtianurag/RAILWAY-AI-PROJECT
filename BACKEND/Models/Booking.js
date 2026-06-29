import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainName: {
      type: String,
      required: true,
    },
    trainNo: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    passengers: [
      {
        name: { type: String, required: true },
        age: { type: String, required: true },
        gender: { type: String, required: true },
        berth: { type: String, required: true },
        seat: { type: String, required: true },
      },
    ],
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "CONFIRMED",
    },
    date: {
      type: String,
      required: true,
    },
    pnr: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
