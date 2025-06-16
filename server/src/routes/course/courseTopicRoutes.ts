import express, { Request, Response } from "express";
import * as TopicModel from "../../models/courseTopicModel";
const router = express.Router();

// Lấy danh sách chủ đề theo courseId
router.get("/", async (req, res) => {
  const courseId = Number(req.query.courseId);
  if (!courseId) {
    res.status(400).json({ error: "Thiếu courseId" });
    return;
  }
  try {
    const topics = await TopicModel.getTopicsByCourseId(courseId);
    res.json(topics);
  } catch {
    res.status(500).json({ error: "Không thể lấy danh sách chủ đề" });
  }
});

// Thêm chủ đề
router.post("/", async (req, res) => {
  try {
    const { course_id, title, description } = req.body;
    const topic = await TopicModel.createTopic({
      course_id,
      title,
      description,
    });
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ error: "Không thể thêm chủ đề" });
  }
});

// Sửa chủ đề
router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const topic = await TopicModel.updateTopic(Number(req.params.id), {
      title,
      description,
    });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ error: "Không thể sửa chủ đề" });
  }
});

// Xóa chủ đề
router.delete("/:id", async (req, res) => {
  try {
    await TopicModel.deleteTopic(Number(req.params.id));
    res.json({ message: "Đã xóa chủ đề" });
  } catch (err) {
    res.status(500).json({ error: "Không thể xóa chủ đề" });
  }
});

export default router;
