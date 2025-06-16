import { Request, Response } from "express";
import * as examQuestionModel from "../models/examQuestionModel";

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { exam_id, question_text, options, correct_answer } = req.body;
    // Kiểu câu hỏi mặc định là 'multiple_choice'
    const question = await examQuestionModel.createQuestion({
      exam_id,
      question_text,
      question_type: "multiple_choice",
      options,
      correct_answer,
    });
    res.status(201).json(question);
  } catch (err) {
    console.error("CREATE QUESTION ERROR:", err);
    res.status(500).json({ error: "Lỗi server khi tạo câu hỏi" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await examQuestionModel.updateQuestion(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("UPDATE QUESTION ERROR:", err);
    res.status(500).json({ error: "Lỗi server khi sửa câu hỏi" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await examQuestionModel.deleteQuestion(id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE QUESTION ERROR:", err);
    res.status(500).json({ error: "Lỗi server khi xóa câu hỏi" });
  }
};
