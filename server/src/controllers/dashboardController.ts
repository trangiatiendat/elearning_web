import { Request, Response, RequestHandler } from "express";
import * as UserModel from "../models/userModel";
import * as CourseModel from "../models/courseModel";
import * as AssignmentModel from "../models/assignmentModel";
import * as ExamModel from "../models/examModel";
import * as HistoryLogModel from "../models/historyLogModel";
import * as StudentCourseModel from "../models/studentCourseModel";

export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    // Lấy user_id giáo viên hiện tại
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // Số khóa học giáo viên đang dạy
    const courses = await CourseModel.getCoursesByTeacherId(userId);
    const courseCount = courses.length;
    // Số bài tập do giáo viên tạo
    const assignments = await AssignmentModel.getAssignmentsByTeacherId(userId);
    const assignmentCount = assignments.length;
    // Số bài kiểm tra do giáo viên tạo
    const exams = await ExamModel.getExamsByTeacherId(userId);
    const examCount = exams.length;
    // Số học sinh duy nhất trong các khóa học giáo viên dạy
    let studentIds = new Set<number>();
    for (const course of courses) {
      const students = await StudentCourseModel.getStudentsByCourseId(
        course.id
      );
      students.forEach((s: any) => studentIds.add(s.id));
    }
    const studentCount = studentIds.size;
    res.json({
      studentCount,
      courseCount,
      assignmentCount,
      examCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy hoạt động gần đây của giáo viên
export const getRecentActivities: RequestHandler = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      res.status(400).json({ message: "Missing user_id" });
      return;
    }
    const logs = await HistoryLogModel.getLogsByUserId(Number(user_id));
    const allowedActions = [
      "create_course",
      "update_course",
      "delete_course",
      "create_exam",
      "update_exam",
      "delete_exam",
      "create_assignment",
      "update_assignment",
      "delete_assignment",
    ];
    const filtered = logs
      .filter((log: any) => allowedActions.includes(log.action))
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy hoạt động gần đây của học sinh
export const getRecentActivitiesStudent: RequestHandler = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      res.status(400).json({ message: "Missing user_id" });
      return;
    }
    const logs = await HistoryLogModel.getLogsByUserId(Number(user_id));
    const allowedActions = [
      "register_course",
      "submit_assignment",
      "take_exam",
    ];
    const filtered = logs
      .filter((log: any) => allowedActions.includes(log.action))
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)
      .map((log: any) => ({
        ...log,
        action:
          log.action === "register_course"
            ? "Đăng ký khóa học"
            : log.action === "submit_assignment"
            ? "Đã nộp bài tập"
            : log.action === "take_exam"
            ? "Đã làm bài kiểm tra"
            : log.action,
      }));
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
