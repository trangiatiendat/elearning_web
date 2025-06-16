import { Router } from "express";
import * as examController from "../controllers/examController";
import { authenticateToken } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyFace } from "../controllers/examController";
import { submitExam } from "../controllers/examController";

const router = Router();

console.log("examRoutes loaded");

// Tạo đề thi mới
router.post("/", authenticateToken, asyncHandler(examController.createExam));

// Lấy danh sách đề thi theo course
router.get(
  "/by-course/:courseId",
  authenticateToken,
  asyncHandler(examController.getExamsByCourseId)
);

// Lấy chi tiết đề thi (bao gồm câu hỏi)
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(examController.getExamDetail)
);

// Lấy tất cả đề thi (cho giáo viên)
router.get("/", authenticateToken, asyncHandler(examController.getAllExams));

// Sửa đề thi
router.put("/:id", authenticateToken, asyncHandler(examController.updateExam));

// Xóa đề thi
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(examController.deleteExam)
);

router.post("/:examId/face-verification", authenticateToken, verifyFace);

router.post("/:examId/submit", authenticateToken, submitExam);

// Lấy danh sách đề thi cho sinh viên (từ các khóa học đã đăng ký)
router.get(
  "/student/my-exams",
  authenticateToken,
  asyncHandler(require("../controllers/examController").getExamsByStudent)
);

export default router;
