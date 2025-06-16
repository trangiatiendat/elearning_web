import * as TopicModel from "../../models/courseTopicModel";
import * as MaterialModel from "../../models/courseMaterialModel";
import { Request as ExpressRequest, Response } from "express";

interface Request extends ExpressRequest {
  user?: {
    id: number;
    role: string;
  };
}

export const getTopicsByCourseId = async (req: Request, res: Response) => {
  const courseId = Number(req.params.courseId);
  try {
    const topics = await TopicModel.getTopicsByCourseId(courseId);
    for (const topic of topics) {
      topic.materials = await MaterialModel.getMaterialsByTopicId(topic.id);
    }
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const createTopic = async (req: Request, res: Response) => {
  try {
    const { course_id, title, description } = req.body;
    if (!course_id || !title) {
      return res.status(400).json({ error: "Thiếu thông tin chủ đề" });
    }
    const topic = await TopicModel.createTopic({
      course_id,
      title,
      description,
    });
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  try {
    const topicId = Number(req.params.id);
    const { title, description } = req.body;
    const topic = await TopicModel.updateTopic(topicId, { title, description });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const topicId = Number(req.params.id);
    await TopicModel.deleteTopic(topicId);
    res.json({ message: "Đã xóa chủ đề" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
