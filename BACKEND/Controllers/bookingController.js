import Booking from "../Models/Booking.js";

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    const {
      trainName,
      trainNo,
      route,
      class: ticketClass,
      passengers,
      fare,
      status,
      date,
      pnr,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!trainName || !trainNo || !route || !ticketClass || !passengers || !fare || !date || !pnr || !paymentMethod) {
      return res.status(400).json({ message: "Missing required booking details" });
    }

    const newBooking = await Booking.create({
      userId: req.user._id,
      trainName,
      trainNo,
      route,
      class: ticketClass,
      passengers,
      fare,
      status: status || "CONFIRMED",
      date,
      pnr,
      paymentMethod,
    });

    res.status(201).json({
      message: "Booking saved successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error while saving booking" });
  }
};

/* ================= GET USER BOOKINGS ================= */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error while retrieving bookings" });
  }
};

/* ================= GET BOOKING BY PNR ================= */
export const getBookingByPNR = async (req, res) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr });

    if (!booking) {
      return res.status(404).json({ message: "PNR not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Get booking by PNR error:", err);
    res.status(500).json({ message: "Server error while retrieving PNR status" });
  }
};

/* ================= CANCEL BOOKING ================= */
export const cancelBooking = async (req, res) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify ownership
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "CANCELLED";
    booking.cancelled = true;
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: "Server error while cancelling booking" });
  }
};
