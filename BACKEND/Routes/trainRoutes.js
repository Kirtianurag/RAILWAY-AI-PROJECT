import express from "express";
import { 
  searchStations, 
  getRecommendedTrains, 
  searchTrainsBetweenStations,
  getSeatAvailability,
  getLiveTrainStatus
} from "../Controllers/trainController.js";

const router = express.Router();

router.get("/stations", searchStations);
router.get("/recommended", getRecommendedTrains);
router.get("/search", searchTrainsBetweenStations);
router.get("/availability", getSeatAvailability);
router.get("/live-status", getLiveTrainStatus);

export default router;
