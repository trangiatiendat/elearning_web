import { Request, Response } from "express";
import pool from "../config/db";

interface AuthRequest extends Request {
  user?: any;
}

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, name, email, avatar, date_of_birth, created_at, role_id FROM users WHERE id = $1 AND role_id = 2`,
      [userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy thông tin giáo viên" });
      return;
    }
    const teacher = { ...result.rows[0], role: "teacher" };
    res.json(teacher);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const updateAvatar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;
    if (!avatar) {
      res.status(400).json({ error: "Avatar URL is required" });
      return;
    }
    const result = await pool.query(
      `UPDATE users SET avatar = $1 WHERE id = $2 AND role_id = 2 RETURNING id, name, email, role_id, avatar`,
      [avatar, userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy thông tin giáo viên" });
      return;
    }
    const teacher = { ...result.rows[0], role: "teacher" };
    res.json(teacher);
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
    const { name, avatar, date_of_birth } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = $1, avatar = $2, date_of_birth = $3 WHERE id = $4 AND role_id = 2 RETURNING id, name, email, avatar, date_of_birth, created_at, role_id`,
      [name, avatar, date_of_birth, userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy thông tin giáo viên" });
      return;
    }
    const teacher = { ...result.rows[0], role: "teacher" };
    res.json(teacher);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};
