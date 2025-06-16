import { Request, Response } from "express";
import pool from "../config/db";

export const getMyExamResults = async (req: any, res: Response) => {
  console.log("==> getMyExamResults CALLED");
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Không xác thực được người dùng" });
    }
    const studentId = req.user.id;
    // Lấy tất cả bài nộp của sinh viên
    const subRes = await pool.query(
      `SELECT s.*, e.title as exam_title, e.duration_minutes, e.start_time, e.end_time, c.name as course_name
       FROM exam_submissions s
       JOIN exams e ON s.exam_id = e.id
       LEFT JOIN courses c ON e.course_id = c.id
       WHERE s.student_id = $1
       ORDER BY s.id DESC`,
      [studentId]
    );
    const submissions = subRes.rows || [];
    if (submissions.length === 0) {
      res.json([]); // Không có kết quả nào
      return;
    }
    // Lấy điểm cho từng bài nộp
    const results = await Promise.all(
      submissions.map(async (sub: any) => {
        const resultRes = await pool.query(
          "SELECT * FROM exam_results WHERE submission_id = $1",
          [sub.id]
        );
        return {
          exam_id: sub.exam_id,
          course_id: sub.course_id,
          exam_title: sub.exam_title,
          course_name: sub.course_name,
          duration_minutes: sub.duration_minutes,
          start_time: sub.start_time,
          end_time: sub.end_time,
          score: resultRes.rows[0]?.score || null,
        };
      })
    );
    res.json(results);
    return;
  } catch (err: any) {
    console.error("Lỗi khi lấy kết quả thi:", err);
    res.status(500).json({
      error: "Lỗi khi lấy kết quả thi",
      detail: err.message,
      stack: err.stack,
    });
    return;
  }
};

export const getResultsByExamId = async (req: Request, res: Response) => {
  const { examId } = req.params;
  try {
    const result = await pool.query(
      `SELECT s.id as submission_id, s.student_id, u.name as student_name, u.email as student_email, r.score, s.submitted_at
       FROM exam_submissions s
       JOIN users u ON s.student_id = u.id
       LEFT JOIN exam_results r ON r.submission_id = s.id
       WHERE s.exam_id = $1
       ORDER BY s.submitted_at DESC`,
      [examId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("Lỗi khi lấy kết quả thi theo examId:", err);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy kết quả thi", detail: err.message });
  }
};

export const getExamResultsByTeacher = async (req: any, res: Response) => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(401).json({ error: "Không xác thực" });
    }
    // Lấy tất cả kết quả thi của các exam mà giáo viên là người tạo khóa học
    const result = await pool.query(
      `
      SELECT s.id as submission_id, s.student_id, u.name as student_name, u.email as student_email, r.score, s.submitted_at, e.title as exam_title, c.name as course_name
      FROM exam_submissions s
      JOIN users u ON s.student_id = u.id
      LEFT JOIN exam_results r ON r.submission_id = s.id
      JOIN exams e ON s.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE c.teacher_id = $1
      ORDER BY s.submitted_at DESC
    `,
      [teacherId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("Lỗi khi lấy kết quả thi theo giáo viên:", err);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy kết quả thi", detail: err.message });
  }
};
