import express from "express";
import { 
  searchStations, 
  getRecommendedTrains, 
  searchTrainsBetweenStations 
} from "../Controllers/trainController.js";

const router = express.Router();

router.get("/stations", searchStations);
router.get("/recommended", getRecommendedTrains);
router.get("/search", searchTrainsBetweenStations);

export default router;
