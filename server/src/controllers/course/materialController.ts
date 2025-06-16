import * as MaterialModel from "../../models/courseMaterialModel";
import { Request as ExpressRequest, Response } from "express";

interface Request extends ExpressRequest {
  user?: {
    id: number;
    role: string;
  };
}

export const getMaterialsByTopicId = async (req: Request, res: Response) => {
  const topicId = Number(req.params.topicId);
  try {
    const materials = await MaterialModel.getMaterialsByTopicId(topicId);
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { topic_id, type, title, url } = req.body;
    if (!topic_id || !type || !title || !url) {
      return res.status(400).json({ error: "Thiếu thông tin tài liệu" });
    }
    const material = await MaterialModel.createMaterial({
      topic_id,
      type,
      title,
      url,
    });
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const materialId = Number(req.params.id);
    const { type, title, url } = req.body;
    const material = await MaterialModel.updateMaterial(materialId, {
      type,
      title,
      url,
    });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const materialId = Number(req.params.id);
    await MaterialModel.deleteMaterial(materialId);
    res.json({ message: "Đã xóa tài liệu" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
