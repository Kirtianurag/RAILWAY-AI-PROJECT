import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SeatAvailability from "./pages/SeatAvailability";
import FareCalculator from "./pages/FareCalculator";
import PNRStatus from "./pages/PNRStatus";
import SearchTrains from "./pages/SearchTrains";
import BookTicket from "./pages/BookTicket";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";
import BookingHistory from "./pages/BookingHistory";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome / Landing Page */}
        <Route path="/" element={<Welcome />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/seat-availability" element={<SeatAvailability />} />
      <Route path="/fare-calculator" element={<FareCalculator />} />
      <Route path="/pnr-status" element={<PNRStatus />} />
      <Route path="/search-trains" element={<SearchTrains />} />
      <Route path="/book-ticket" element={<BookTicket />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/booking-history" element={<BookingHistory />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
