import { Router } from "express";
import * as assignmentController from "../controllers/assignment/assignmentController";
import { authenticateToken } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { upload, uploadMemory } from "../services/uploadService";
import * as studentAssignmentController from "../controllers/assignment/studentAssignmentController";

const router = Router();

// Lấy tất cả bài tập
router.get("/", asyncHandler(assignmentController.getAllAssignments));

// Lấy bài tập theo topic
router.get(
  "/topic/:topicId",
  asyncHandler(assignmentController.getAssignmentsByTopic)
);

// Lấy tất cả bài tập của giáo viên
router.get(
  "/teacher",
  authenticateToken,
  asyncHandler(assignmentController.getAssignmentsByTeacher)
);

// Lấy chi tiết 1 bài tập
router.get("/:id", asyncHandler(assignmentController.getAssignmentById));

// Tạo bài tập mới (giáo viên)
router.post(
  "/",
  authenticateToken,
  upload.single("attachment"),
  asyncHandler(assignmentController.createAssignment)
);

// Sửa bài tập (giáo viên)
router.put(
  "/:id",
  authenticateToken,
  upload.single("attachment"),
  asyncHandler(assignmentController.updateAssignment)
);

// Xóa bài tập (giáo viên)
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(assignmentController.deleteAssignment)
);

// Nộp bài tập (student)
router.post(
  "/:assignmentId/submit",
  authenticateToken,
  uploadMemory.single("file"),
  asyncHandler(studentAssignmentController.submitAssignment)
);

// Lấy danh sách bài nộp của sinh viên cho giáo viên
router.get(
  "/teacher/submissions",
  authenticateToken,
  asyncHandler(
    assignmentController.getCourseAssignmentsAndSubmissionsForTeacher
  )
);

export default router;
