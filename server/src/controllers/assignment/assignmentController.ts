import { Request, Response, NextFunction } from "express";
import * as AssignmentModel from "../../models/assignmentModel";
import { uploadToCloudinary } from "../../services/cloudinaryUploadService";
import fs from "fs";
import { createLog } from "../../models/historyLogModel";

// Lấy tất cả bài tập
export const getAllAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignments = await AssignmentModel.getAllAssignments();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

// Lấy bài tập theo id
export const getAssignmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Thiếu id" });
    const assignment = await AssignmentModel.getAssignmentById(id);
    if (!assignment)
      return res.status(404).json({ error: "Không tìm thấy bài tập" });
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

// Tạo bài tập mới
export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[createAssignment] req.body:", req.body);
    console.log("[createAssignment] req.file:", req.file);
    const body = req.body || {};
    const topic_id = Number(body.topic_id);
    const title = body.title;
    const description = body.description;
    const due_date = body.due_date;
    if (!topic_id || !title)
      return res.status(400).json({ error: "Thiếu thông tin bài tập" });

    let attachment_url: string | undefined = undefined;
    if (req.file) {
      // Upload lên Cloudinary
      const result = await uploadToCloudinary(
        req.file.path,
        "auto",
        "assignments"
      );
      attachment_url = result.secure_url;
      fs.unlinkSync(req.file.path); // Xóa file tạm
    }

    const assignment = await AssignmentModel.createAssignment({
      topic_id,
      title,
      description,
      due_date,
      attachment_url,
    });
    // Ghi log hoạt động nếu có user
    const userId = (req as any).user?.id;
    if (userId) {
      await createLog({
        user_id: userId,
        action: "create_assignment",
        details: `Tạo bài tập: ${assignment.title}`,
      });
    }
    res.status(201).json(assignment);
  } catch (err) {
    console.error("[createAssignment] Error:", err);
    next(err);
  }
};

// Sửa bài tập
export const updateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[updateAssignment] req.body:", req.body);
    console.log("[updateAssignment] req.file:", req.file);
    const id = Number(req.params.id);
    const body = req.body || {};
    if (!id) return res.status(400).json({ error: "Thiếu id" });

    const updateData: {
      title?: string;
      description?: string;
      due_date?: string;
      attachment_url?: string;
    } = {
      title: body.title,
      description: body.description,
      due_date: body.dueDate || body.due_date,
    };

    if (req.file) {
      // Upload lên Cloudinary
      const result = await uploadToCloudinary(
        req.file.path,
        "auto",
        "assignments"
      );
      console.log("[updateAssignment] Cloudinary result:", result);
      updateData.attachment_url = result.secure_url;
      fs.unlinkSync(req.file.path); // Xóa file tạm
    }

    const updated = await AssignmentModel.updateAssignment(id, updateData);
    // Ghi log hoạt động nếu có user
    const userId = (req as any).user?.id;
    if (userId && updated) {
      await createLog({
        user_id: userId,
        action: "update_assignment",
        details: `Sửa bài tập: ${updated.title}`,
      });
    }
    res.json(updated);
  } catch (err) {
    console.error("[updateAssignment] Error:", err);
    next(err);
  }
};

// Xóa bài tập
export const deleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Thiếu id" });
    // Lấy tên bài tập trước khi xóa
    const assignment = await AssignmentModel.getAssignmentById(id);
    await AssignmentModel.deleteAssignment(id);
    // Ghi log hoạt động nếu có user
    const userId = (req as any).user?.id;
    if (userId && assignment) {
      await createLog({
        user_id: userId,
        action: "delete_assignment",
        details: `Xóa bài tập: ${assignment.title}`,
      });
    }
    res.json({ message: "Đã xóa bài tập" });
  } catch (err) {
    next(err);
  }
};

// Lấy bài tập theo topic
export const getAssignmentsByTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topicId = Number(req.params.topicId);
    if (!topicId) return res.status(400).json({ error: "Thiếu topicId" });
    const assignments = await AssignmentModel.getAssignmentsByTopicId(topicId);
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

// Lấy bài tập theo giáo viên
export const getAssignmentsByTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacherId = (req as any).user?.id;
    if (!teacherId) return res.status(401).json({ error: "Không xác thực" });
    const assignments = await AssignmentModel.getAssignmentsByTeacherId(
      teacherId
    );
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

// Get courses, assignments, and student submissions for a teacher
export const getCourseAssignmentsAndSubmissionsForTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacherId = (req as any).user?.id;
    if (!teacherId) return res.status(401).json({ error: "Không xác thực" });

    const data =
      await AssignmentModel.getCourseAssignmentsAndSubmissionsForTeacher(
        teacherId
      );
    res.json(data);
  } catch (err) {
    console.error("[getCourseAssignmentsAndSubmissionsForTeacher] Error:", err);
    next(err);
  }
};
