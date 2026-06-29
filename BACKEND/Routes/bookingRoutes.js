import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import {
  createBooking,
  getUserBookings,
  getBookingByPNR,
  cancelBooking,
} from "../Controllers/bookingController.js";

const router = express.Router();

// Protected routes (require user login)
router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getUserBookings);
router.put("/:pnr/cancel", authMiddleware, cancelBooking);

// Public route (anyone can check PNR status)
router.get("/:pnr", getBookingByPNR);

export default router;
