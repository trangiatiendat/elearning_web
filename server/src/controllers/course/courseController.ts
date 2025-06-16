import { Request as ExpressRequest, Response } from "express";
import * as CourseModel from "../../models/courseModel";
import * as TopicModel from "../../models/courseTopicModel";
import * as MaterialModel from "../../models/courseMaterialModel";
import { uploadToCloudinary } from "../../services/cloudinaryUploadService";
import fs from "fs";
import { createFullCourse } from "../../services/courseService";

interface Request extends ExpressRequest {
  user?: {
    id: number;
    role: string;
  };
}

const getSafeImageUrl = (img: string | undefined): string => {
  const defaultImg =
    "https://res.cloudinary.com/xxx/image/upload/default-course.png";
  if (!img) return defaultImg;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return defaultImg;
};

export const getAllCourses = (req: Request, res: Response) => {
  CourseModel.getAllCourses()
    .then((courses) => {
      const updatedCourses = courses.map((course) => ({
        ...course,
        image_url: course.image_url || null,
      }));
      res.json(updatedCourses);
    })
    .catch(() => res.status(500).json({ error: "Lỗi server" }));
};

export const getCourseById = async (req: Request, res: Response) => {
  const courseId = Number(req.params.id);
  try {
    const course = await CourseModel.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Không tìm thấy khóa học" });
    }
    // Lấy danh sách topics và materials cho mỗi topic
    const topics = await TopicModel.getTopicsByCourseId(courseId);
    for (const topic of topics) {
      topic.materials = await MaterialModel.getMaterialsByTopicId(topic.id);
    }
    return res.json({
      ...course,
      image_url: course.image_url || null,
      topics,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Lỗi server",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
};

export const searchCourses = (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;
  if (!searchTerm) {
    res.status(400).json({ error: "Thiếu từ khóa tìm kiếm" });
    return;
  }
  CourseModel.searchCourses(searchTerm)
    .then((courses) => {
      const updatedCourses = courses.map((course) => ({
        ...course,
        image_url: course.image_url || null,
      }));
      res.json(updatedCourses);
    })
    .catch(() => res.status(500).json({ error: "Lỗi server" }));
};
