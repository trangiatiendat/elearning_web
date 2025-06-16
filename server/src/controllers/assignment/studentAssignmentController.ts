import { Request, Response } from "express";
import { getAssignmentsByStudentId } from "../../models/assignmentModel";
import { createSubmission } from "../../models/assignmentSubmissionModel";
import { getAssignmentsByStudentId as getAssignmentDetailsForStudent } from "../../models/assignmentModel";
import pool from "../../config/db";
import cloudinary from "../../config/cloudinary";

export const getStudentAssignments = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || typeof user.id !== "number" || isNaN(user.id)) {
      res
        .status(401)
        .json({ error: "Bạn chưa đăng nhập hoặc token không hợp lệ" });
      return;
    }
    const studentId = user.id;
    const courseId = req.query.courseId
      ? Number(req.query.courseId)
      : undefined;
    let assignments = await getAssignmentsByStudentId(studentId);
    if (courseId) {
      assignments = assignments.filter((a) => a.course_id === courseId);
    }
    res.json(assignments);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi server",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
};

// Nộp bài tập (student)
export const submitAssignment = async (req: any, res: any) => {
  try {
    const user = req.user;
    if (!user || typeof user.id !== "number" || isNaN(user.id)) {
      return res
        .status(401)
        .json({ error: "Bạn chưa đăng nhập hoặc token không hợp lệ" });
    }
    const studentId = user.id;
    const assignmentId = Number(req.params.assignmentId);
    if (!assignmentId) {
      return res.status(400).json({ error: "Thiếu assignmentId" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Vui lòng upload file" });
    }
    const fileBuffer = req.file.buffer;
    const fileOriginalName = req.file.originalname;

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "assignment_submissions",
          public_id: `${assignmentId}_${studentId}_${Date.now()}_${fileOriginalName.replace(
            /\s/g,
            "_"
          )}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });

    const file_url = uploadResult.secure_url;

    const existingSubmission = (
      await pool.query(
        "SELECT * FROM assignment_submissions WHERE assignment_id = $1 AND student_id = $2",
        [assignmentId, studentId]
      )
    ).rows[0];

    let submission;
    if (existingSubmission) {
      submission = (
        await pool.query(
          "UPDATE assignment_submissions SET file_url = $1, submitted_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
          [file_url, existingSubmission.id]
        )
      ).rows[0];
    } else {
      submission = await createSubmission({
        assignment_id: assignmentId,
        student_id: studentId,
        file_url,
      });
    }

    const updatedAssignment = (await getAssignmentsByStudentId(studentId)).find(
      (a) => a.id === assignmentId
    );

    if (updatedAssignment) {
      // Ghi log hoạt động
      await require("../../models/historyLogModel").createLog({
        user_id: studentId,
        action: "submit_assignment",
        details: `Nộp bài tập: ${updatedAssignment.title || assignmentId}`,
      });
      res.json(updatedAssignment);
    } else {
      res.status(200).json(submission);
    }
  } catch (err) {
    res.status(500).json({
      error: "Lỗi server khi nộp bài",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
};
