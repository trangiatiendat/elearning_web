import { Router } from "express";
import * as examQuestionController from "../controllers/examQuestionController";
import { authenticateToken } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Tạo câu hỏi mới cho đề thi
router.post(
  "/",
  authenticateToken,
  asyncHandler(examQuestionController.createQuestion)
);

// Sửa câu hỏi
router.put(
  "/:id",
  authenticateToken,
  asyncHandler(examQuestionController.updateQuestion)
);

// Xóa câu hỏi
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(examQuestionController.deleteQuestion)
);

export default router;
