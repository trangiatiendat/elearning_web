import { Request, Response } from "express";
import * as examModel from "../models/examModel";
import * as examQuestionModel from "../models/examQuestionModel";
import axios from "axios";
import pool from "../config/db";
import * as examSubmissionModel from "../models/examSubmissionModel";
import * as examResultModel from "../models/examResultModel";
import { createLog } from "../models/historyLogModel";

export const createExam = async (req: Request, res: Response) => {
  try {
    const {
      course_id,
      title,
      description,
      start_time,
      end_time,
      duration_minutes,
    } = req.body;
    const exam = await examModel.createExam({
      course_id,
      title,
      description,
      start_time,
      end_time,
      duration_minutes,
    });
    // Ghi log hoạt động nếu có user
    const userId = (req as any).user?.id;
    if (userId) {
      await createLog({
        user_id: userId,
        action: "create_exam",
        details: `Tạo bài kiểm tra: ${exam.title}`,
      });
    }
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi tạo đề thi" });
  }
};

export const getExamsByCourseId = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const exams = await examModel.getExamsByCourseId(courseId);
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy danh sách đề thi" });
  }
};

export const getExamDetail = async (req: any, res: Response) => {
  try {
    const examId = Number(req.params.id);
    const exam = await examModel.getExamById(examId);
    if (!exam) return res.status(404).json({ error: "Không tìm thấy đề thi" });
    const questions = await examQuestionModel.getQuestionsByExamId(examId);
    // Lấy tên sinh viên từ userId (đã xác thực)
    let student_name = undefined;
    let has_submitted = false;
    let submission_id = null;
    let score = null;
    if (req.user && req.user.id) {
      const userRes = await pool.query("SELECT name FROM users WHERE id = $1", [
        req.user.id,
      ]);
      student_name = userRes.rows[0]?.name;
      // Kiểm tra đã nộp bài chưa
      const subRes = await pool.query(
        "SELECT * FROM exam_submissions WHERE exam_id = $1 AND student_id = $2",
        [examId, req.user.id]
      );
      if (subRes.rows.length > 0) {
        has_submitted = true;
        submission_id = subRes.rows[0].id;
        // Lấy điểm nếu có
        const resultRes = await pool.query(
          "SELECT * FROM exam_results WHERE submission_id = $1",
          [submission_id]
        );
        if (resultRes.rows.length > 0) {
          score = resultRes.rows[0].score;
        }
      }
    }
    res.json({
      ...exam,
      questions,
      student_name,
      has_submitted,
      submission_id,
      score,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết đề thi" });
  }
};

export const getAllExams = async (req: Request, res: Response) => {
  try {
    const teacherId = (req as any).user?.id;
    if (!teacherId) {
      return res.status(401).json({ error: "Không xác thực" });
    }
    const exams = await examModel.getExamsByTeacherId(teacherId);
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy danh sách đề thi" });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await examModel.updateExam(id, req.body);
    // Ghi log hoạt động nếu có user
    const userId = (req as any).user?.id;
    if (userId && updated) {
      await createLog({
        user_id: userId,
        action: "update_exam",
        details: `Sửa bài kiểm tra: ${updated.title}`,
      });
    }
    res.json(updated);
  } catch (err) {
    console.error("UPDATE EXAM ERROR:", err);
    res.status(500).json({ error: "Lỗi server khi sửa đề thi" });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // Lấy tên bài kiểm tra trước khi xóa
    const exam = await examModel.getExamById(id);
    await examModel.deleteExam(id);
    // Ghi log hoạt động nếu có user
    const userId = (req as any).user?.id;
    if (userId && exam) {
      await createLog({
        user_id: userId,
        action: "delete_exam",
        details: `Xóa bài kiểm tra: ${exam.title}`,
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE EXAM ERROR:", err);
    res.status(500).json({ error: "Lỗi server khi xóa đề thi" });
  }
};

export const verifyFace = async (req: any, res: Response): Promise<void> => {
  try {
    const { image } = req.body;
    const userId = req.user.id;
    // Lấy avatar (URL Cloudinary) của user
    const user = await pool.query("SELECT avatar FROM users WHERE id = $1", [
      userId,
    ]);
    if (!user.rows[0]?.avatar) {
      res.status(400).json({ error: "Chưa có avatar" });
      return;
    }

    // Gửi sang Python AI service
    const pyRes = await axios.post("http://localhost:5001/verify", {
      img1: user.rows[0].avatar, // URL Cloudinary
      img2: image, // base64 webcam
    });
    if (pyRes.data.success) {
      res.json({ success: true });
      return;
    } else {
      res.status(401).json({ error: "Khuôn mặt không phù hợp" });
      return;
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Lỗi xác thực khuôn mặt", detail: err.message });
  }
};

export const submitExam = async (req: any, res: Response) => {
  try {
    const examId = Number(req.params.examId);
    const studentId = req.user.id;
    const { answers } = req.body;
    // Lấy đáp án đúng
    const questions = await examQuestionModel.getQuestionsByExamId(examId);
    // Chuyển answers từ A/B/C/D sang giá trị thực
    const realAnswers: Record<string, string> = {};
    questions.forEach((q: any) => {
      const ans = answers[q.id];
      if (
        ans &&
        typeof ans === "string" &&
        ans.length === 1 &&
        q.options &&
        Array.isArray(q.options)
      ) {
        const idx = ans.toUpperCase().charCodeAt(0) - 65;
        if (idx >= 0 && idx < q.options.length) {
          realAnswers[q.id] = q.options[idx];
        }
      } else if (ans) {
        realAnswers[q.id] = ans;
      }
    });
    // Lưu bài làm với đáp án thực
    const submission = await examSubmissionModel.createSubmission({
      exam_id: examId,
      student_id: studentId,
      answers: realAnswers,
    });
    // Chấm điểm
    let correctCount = 0;
    questions.forEach((q: any) => {
      if (realAnswers[q.id] && q.correct_answer) {
        if (
          (realAnswers[q.id] || "").trim().toLowerCase() ===
          (q.correct_answer || "").trim().toLowerCase()
        ) {
          correctCount++;
        }
      }
    });
    const totalQuestions = questions.length;
    const score =
      totalQuestions > 0
        ? parseFloat(((correctCount / totalQuestions) * 10).toFixed(2))
        : 0;
    // Lưu điểm
    await examResultModel.createResult({
      submission_id: submission.id,
      score,
      auto_graded: true,
    });
    // Ghi log hoạt động
    await createLog({
      user_id: studentId,
      action: "take_exam",
      details: `Nộp bài kiểm tra: ${examId}`,
    });
    res.json({
      success: true,
      score,
      correct: correctCount,
      wrong: totalQuestions - correctCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi nộp bài thi" });
  }
};

export const getExamsByStudent = async (req: any, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ error: "Không xác thực" });
    }
    const exams = await examModel.getExamsByStudentId(studentId);
    res.json(exams);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi server khi lấy danh sách đề thi cho sinh viên" });
  }
};
