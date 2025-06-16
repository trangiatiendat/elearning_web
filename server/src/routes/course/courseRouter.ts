import { Router, RequestHandler } from "express";
import * as courseController from "../../controllers/course/courseController";
import * as topicController from "../../controllers/course/topicController";
import * as materialController from "../../controllers/course/materialController";
import * as studentCourseController from "../../controllers/course/studentCourseController";
import * as teacherCourseController from "../../controllers/course/teacherCourseController";
import {
  authenticateToken,
  requireTeacher,
  requireStudent,
} from "../../middlewares/auth";
import { upload } from "../../services/uploadService";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadToCloudinary } from "../../services/cloudinaryUploadService";
import fs from "fs";

const router = Router();

// Course routes
router.get("/", asyncHandler(courseController.getAllCourses));
router.get("/search", asyncHandler(courseController.searchCourses));
router.get(
  "/:id",
  authenticateToken as RequestHandler,
  asyncHandler(courseController.getCourseById)
);

// Teacher protected course routes
const protectedRouter = Router();
protectedRouter.use(authenticateToken as RequestHandler);
protectedRouter.use(requireTeacher as RequestHandler);
protectedRouter.get(
  "/courses",
  asyncHandler(teacherCourseController.getCoursesByTeacherId)
);
protectedRouter.post(
  "/",
  upload.single("image"),
  asyncHandler(teacherCourseController.createCourse)
);
protectedRouter.put(
  "/:id",
  upload.single("image"),
  asyncHandler(teacherCourseController.updateCourse)
);
protectedRouter.delete(
  "/:id",
  asyncHandler(teacherCourseController.deleteCourse)
);
protectedRouter.get(
  "/:id/students",
  authenticateToken,
  requireTeacher,
  asyncHandler(teacherCourseController.getStudentsByCourseId)
);
router.use("/teacher", protectedRouter);

// Topic routes
router.get(
  "/topics/:courseId",
  authenticateToken,
  asyncHandler(topicController.getTopicsByCourseId)
);
router.post(
  "/topics",
  authenticateToken,
  requireTeacher,
  asyncHandler(topicController.createTopic)
);
router.put(
  "/topics/:id",
  authenticateToken,
  requireTeacher,
  asyncHandler(topicController.updateTopic)
);
router.delete(
  "/topics/:id",
  authenticateToken,
  requireTeacher,
  asyncHandler(topicController.deleteTopic)
);

// Material routes
router.get(
  "/materials/:topicId",
  authenticateToken,
  asyncHandler(materialController.getMaterialsByTopicId)
);
router.post(
  "/materials",
  authenticateToken,
  requireTeacher,
  asyncHandler(materialController.createMaterial)
);
router.put(
  "/materials/:id",
  authenticateToken,
  requireTeacher,
  asyncHandler(materialController.updateMaterial)
);
router.delete(
  "/materials/:id",
  authenticateToken,
  requireTeacher,
  asyncHandler(materialController.deleteMaterial)
);

// Upload material file
router.post("/materials/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Không tìm thấy file" });
    return;
  }
  const fileType = req.file.mimetype;
  let materialType = "other";
  let resourceType: "image" | "video" | "auto" = "auto";
  if (fileType.includes("pdf")) materialType = "pdf";
  else if (fileType.includes("video")) {
    materialType = "video";
    resourceType = "video";
  } else if (fileType.includes("image")) {
    materialType = "image";
    resourceType = "image";
  }
  const result = await uploadToCloudinary(
    req.file.path,
    resourceType,
    "course_materials"
  );
  fs.unlinkSync(req.file.path);
  res.json({
    url: result.secure_url,
    type: materialType,
    originalName: req.file.originalname,
  });
});

// Student course routes
router.get(
  "/student/unregistered",
  authenticateToken,
  requireStudent,
  asyncHandler(studentCourseController.getUnregisteredCoursesForStudent)
);
router.get(
  "/student/registered",
  authenticateToken,
  requireStudent,
  asyncHandler(studentCourseController.getRegisteredCoursesForStudent)
);
router.post(
  "/student/:id/register",
  authenticateToken,
  requireStudent,
  asyncHandler(studentCourseController.registerCourseWithPassword)
);

export default router;
