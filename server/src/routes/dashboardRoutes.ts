import { Router } from "express";
import {
  getDashboardStats,
  getRecentActivities,
  getRecentActivitiesStudent,
} from "../controllers/dashboardController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/stats", authenticateToken, getDashboardStats);
router.get("/recent-activities", authenticateToken, getRecentActivities);
router.get(
  "/recent-activities-student",
  authenticateToken,
  getRecentActivitiesStudent
);

export default router;
