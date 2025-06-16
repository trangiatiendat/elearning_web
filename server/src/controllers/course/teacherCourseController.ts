import { Request as ExpressRequest, Response } from "express";
import * as CourseModel from "../../models/courseModel";
import * as TopicModel from "../../models/courseTopicModel";
import * as MaterialModel from "../../models/courseMaterialModel";
import { uploadToCloudinary } from "../../services/cloudinaryUploadService";
import fs from "fs";
import { createFullCourse } from "../../services/courseService";
import * as StudentCourseModel from "../../models/studentCourseModel";
import { createLog } from "../../models/historyLogModel";

interface Request extends ExpressRequest {
  user?: {
    id: number;
    role: string;
  };
}

export const getCoursesByTeacherId = (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  if (!teacherId) {
    res.status(401).json({ error: "Không tìm thấy thông tin giáo viên" });
    return;
  }
  CourseModel.getCoursesByTeacherId(teacherId)
    .then((courses) => {
      const updatedCourses = courses.map((course) => ({
        ...course,
        image_url: course.image_url || null,
      }));
      res.json(updatedCourses);
    })
    .catch((err) => {
      console.error("[getCoursesByTeacherId]", err, JSON.stringify(err));
      res.status(500).json({
        error: "Lỗi server",
        detail: err && err.message ? err.message : JSON.stringify(err),
      });
    });
};

export const createCourse = async (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  if (!teacherId) {
    res.status(401).json({ error: "Không tìm thấy thông tin giáo viên" });
    return;
  }

  let { name, description, password, topics } = req.body;
  let image_url = req.body.image_url;

  let parsedTopics = topics;

  if (
    req.headers["content-type"]?.startsWith("multipart/form-data") &&
    typeof topics === "string"
  ) {
    try {
      parsedTopics = JSON.parse(topics);
    } catch (parseError) {
      console.error("Failed to parse topics JSON string:", parseError);
      res.status(400).json({ error: "Dữ liệu chủ đề không hợp lệ" });
      return;
    }
  } else if (typeof topics === "string") {
    try {
      parsedTopics = JSON.parse(topics);
    } catch (parseError) {
      console.error("Failed to parse topics JSON string:", parseError);
      res.status(400).json({ error: "Dữ liệu chủ đề không hợp lệ" });
      return;
    }
  } else if (typeof topics === "string") {
    try {
      parsedTopics = JSON.parse(topics);
    } catch (parseError) {
      console.error("Failed to parse topics JSON string:", parseError);
      res.status(400).json({ error: "Dữ liệu chủ đề không hợp lệ" });
      return;
    }
  }

  try {
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.path,
        "image",
        "courses"
      );
      image_url = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    if (!name || name.length < 5) {
      res.status(400).json({ error: "Tên khóa học phải có ít nhất 5 ký tự" });
      return;
    }
    if (!description || description.length < 20) {
      res
        .status(400)
        .json({ error: "Mô tả khóa học phải có ít nhất 20 ký tự" });
      return;
    }
    if (!password || password.length < 4) {
      res
        .status(400)
        .json({ error: "Mật khẩu khóa học phải có ít nhất 4 ký tự" });
      return;
    }
    if (
      !parsedTopics ||
      !Array.isArray(parsedTopics) ||
      parsedTopics.length === 0
    ) {
      res.status(400).json({ error: "Khóa học phải có ít nhất một chủ đề" });
      return;
    }
    for (const topic of parsedTopics) {
      if (!topic.title || topic.title.trim() === "") {
        res.status(400).json({ error: "Tiêu đề chủ đề không được để trống" });
        return;
      }
      if (topic.materials && Array.isArray(topic.materials)) {
        for (const material of topic.materials) {
          if (!material.title || material.title.trim() === "") {
            res
              .status(400)
              .json({ error: "Tiêu đề tài liệu không được để trống" });
            return;
          }
          if (!material.url || material.url.trim() === "") {
            res.status(400).json({ error: "URL tài liệu không được để trống" });
            return;
          }
        }
      }
    }

    const course = await createFullCourse({
      name,
      description,
      teacher_id: teacherId,
      password,
      image_url,
      topics: parsedTopics,
    });

    // Ghi log hoạt động nếu có user
    if (teacherId) {
      await createLog({
        user_id: teacherId,
        action: "create_course",
        details: `Tạo khóa học: ${course.name}`,
      });
    }
    res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: "Lỗi server khi tạo khóa học" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  const courseId = Number(req.params.id);
  try {
    const course = await CourseModel.getCourseById(courseId);
    if (!course) {
      res.status(404).json({ error: "Không tìm thấy khóa học" });
      return;
    }
    if (course.teacher_id !== teacherId) {
      res.status(403).json({ error: "Bạn không có quyền sửa khóa học này" });
      return;
    }
    const allowedFields = ["name", "description", "image_url", "password"];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.path,
        "image",
        "courses"
      );
      updateData.image_url = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "Không có trường nào để cập nhật" });
      return;
    }
    const updatedCourse = await CourseModel.updateCourse(courseId, updateData);
    // Ghi log hoạt động nếu có user
    if (teacherId && updatedCourse) {
      await createLog({
        user_id: teacherId,
        action: "update_course",
        details: `Sửa khóa học: ${updatedCourse.name}`,
      });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const deleteCourse = (req: Request, res: Response) => {
  const teacherId = req.user?.id;
  const courseId = Number(req.params.id);
  CourseModel.getCourseById(courseId)
    .then((course) => {
      if (!course) {
        res.status(404).json({ error: "Không tìm thấy khóa học" });
        return;
      }
      if (course.teacher_id !== teacherId) {
        res.status(403).json({ error: "Bạn không có quyền xóa khóa học này" });
        return;
      }
      CourseModel.deleteCourse(courseId).then(async () => {
        // Ghi log hoạt động nếu có user
        if (teacherId && course) {
          await createLog({
            user_id: teacherId,
            action: "delete_course",
            details: `Xóa khóa học: ${course.name}`,
          });
        }
        res.json({ message: "Đã xóa khóa học" });
      });
    })
    .catch(() => {
      res.status(500).json({ error: "Lỗi server" });
    });
};

export const getStudentsByCourseId = async (req: Request, res: Response) => {
  const courseId = Number(req.params.id);
  if (!courseId) {
    res.status(400).json({ error: "Thiếu course_id" });
    return;
  }
  try {
    const students = await StudentCourseModel.getStudentsByCourseId(courseId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", detail: String(err) });
  }
};
