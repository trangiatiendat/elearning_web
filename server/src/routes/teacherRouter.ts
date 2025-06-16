import express, { RequestHandler } from "express";
import * as teacherController from "../controllers/teacherController";
import * as teacherSubmissionController from "../controllers/assignment/teacherSubmissionController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

// Protect all routes in this router
router.use(authenticateToken as RequestHandler);

// Get teacher profile
router.get("/profile", teacherController.getProfile);

// Update teacher profile
router.put("/profile", teacherController.updateProfile);

// Get course assignments and submissions for teacher
router.get(
  "/assignments/teacher/submissions",
  teacherSubmissionController.getCourseAssignmentsAndSubmissions
);

// Update avatar
router.put("/avatar", teacherController.updateAvatar);

export default router;
