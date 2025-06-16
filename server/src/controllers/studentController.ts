import { Request, Response } from "express";
import pool from "../config/db";
import { uploadToCloudinary } from "../services/cloudinaryUploadService";
import fs from "fs";

interface AuthRequest extends Request {
  user?: any;
}

// Lấy profile học sinh
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, name, email, role_id, avatar, date_of_birth, created_at FROM users WHERE id = $1 AND role_id = 1`,
      [userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy thông tin học sinh" });
      return;
    }
    const student = { ...result.rows[0], role: "student" };
    res.json(student);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const {
      name,
      avatar,
      class: className,
      school,
      phone,
      bio,
      date_of_birth,
    } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = $1, avatar = $2, class = $3, school = $4, phone = $5, bio = $6, date_of_birth = $7 WHERE id = $8 AND role_id = 1 RETURNING id, name, email, avatar, class, school, phone, bio, date_of_birth, role_id`,
      [name, avatar, className, school, phone, bio, date_of_birth, userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy thông tin học sinh" });
      return;
    }
    const student = { ...result.rows[0], role: "student" };
    res.json(student);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Cập nhật avatar
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: "Vui lòng upload file ảnh" });
    }
    // Upload lên Cloudinary
    const result = await uploadToCloudinary(req.file.path, "image", "avatars");
    fs.unlinkSync(req.file.path); // Xóa file tạm
    // Lưu URL vào DB
    const updateResult = await pool.query(
      "UPDATE users SET avatar = $1 WHERE id = $2 RETURNING id, name, email, avatar",
      [result.secure_url, userId]
    );
    res.json({ ...updateResult.rows[0], role: "student" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi upload ảnh" });
  }
};
