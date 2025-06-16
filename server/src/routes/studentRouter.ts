import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updateAvatar,
} from "../controllers/studentController";
import { authenticateToken } from "../middlewares/auth";
import { getStudentAssignments } from "../controllers/assignment/studentAssignmentController";
import { upload } from "../services/uploadService";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Lấy profile học sinh
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler(updateAvatar)
);
router.get("/assignments", authenticateToken, getStudentAssignments);

export default router;
