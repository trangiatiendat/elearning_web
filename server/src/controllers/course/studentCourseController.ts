import * as StudentCourseModel from "../../models/studentCourseModel";
import * as CourseModel from "../../models/courseModel";
import { Request as ExpressRequest, Response } from "express";

interface Request extends ExpressRequest {
  user?: {
    id: number;
    role: string;
  };
}

export const getUnregisteredCoursesForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    const studentId = Number(user?.id);
    if (!user || isNaN(studentId) || !studentId) {
      return res
        .status(401)
        .json({ error: "Bạn chưa đăng nhập hoặc token không hợp lệ" });
    }
    const courses = await StudentCourseModel.getUnregisteredCourses(studentId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi server",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getRegisteredCoursesForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    const studentId = Number(user?.id);
    if (!user || isNaN(studentId) || !studentId) {
      return res
        .status(401)
        .json({ error: "Bạn chưa đăng nhập hoặc token không hợp lệ" });
    }
    const courses = await StudentCourseModel.getRegisteredCourses(studentId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi server",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
};

export const registerCourseWithPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;
    const courseId = Number(req.params.id);
    const { password } = req.body;
    if (!user || user.role !== "student") {
      return res
        .status(401)
        .json({ error: "Bạn chưa đăng nhập hoặc không phải học sinh" });
    }
    if (!password) {
      return res.status(400).json({ error: "Vui lòng nhập mật khẩu khóa học" });
    }
    // Lấy thông tin khóa học
    const course = await CourseModel.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Không tìm thấy khóa học" });
    }
    // Kiểm tra mật khẩu
    if (course.password !== password) {
      return res.status(403).json({ error: "Mật khẩu không đúng" });
    }
    // Kiểm tra đã đăng ký chưa
    const isRegistered = await StudentCourseModel.isRegistered(
      user.id,
      courseId
    );
    if (isRegistered) {
      return res.status(400).json({ error: "Bạn đã đăng ký khóa học này rồi" });
    }
    // Đăng ký khóa học
    const result = await StudentCourseModel.registerCourse(user.id, courseId);
    // Ghi log hoạt động
    await require("../../models/historyLogModel").createLog({
      user_id: user.id,
      action: "register_course",
      details: `Đăng ký khóa học: ${course?.name || courseId}`,
    });
    return res.json({ message: "Đăng ký thành công", data: result });
  } catch (err) {
    return res.status(500).json({
      error: "Lỗi server",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
};
