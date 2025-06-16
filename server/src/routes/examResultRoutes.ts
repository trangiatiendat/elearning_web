import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getMyExamResults,
  getResultsByExamId,
} from "../controllers/examResultController";

const router = Router();

router.get("/my", authenticateToken, asyncHandler(getMyExamResults));
router.get(
  "/by-exam/:examId",
  authenticateToken,
  asyncHandler(getResultsByExamId)
);
router.get(
  "/by-teacher/all",
  authenticateToken,
  asyncHandler(
    require("../controllers/examResultController").getExamResultsByTeacher
  )
);

export default router;
