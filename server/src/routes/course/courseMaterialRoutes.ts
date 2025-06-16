import express from "express";
import * as MaterialModel from "../../models/courseMaterialModel";
const router = express.Router();

// Thêm tài liệu
router.post("/", async (req, res) => {
  try {
    const { topic_id, type, title, url } = req.body;
    const material = await MaterialModel.createMaterial({
      topic_id,
      type,
      title,
      url,
    });
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: "Không thể thêm tài liệu" });
  }
});

// Sửa tài liệu
router.put("/:id", async (req, res) => {
  try {
    const { type, title, url } = req.body;
    const material = await MaterialModel.updateMaterial(Number(req.params.id), {
      type,
      title,
      url,
    });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: "Không thể sửa tài liệu" });
  }
});

// Xóa tài liệu
router.delete("/:id", async (req, res) => {
  try {
    await MaterialModel.deleteMaterial(Number(req.params.id));
    res.json({ message: "Đã xóa tài liệu" });
  } catch (err) {
    res.status(500).json({ error: "Không thể xóa tài liệu" });
  }
});

export default router;
