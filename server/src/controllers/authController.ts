import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";

interface AuthRequest extends Request {
  user?: any;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role_id } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      res.status(400).json({ error: "Email đã được sử dụng" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role_id]
    );
    const { password: _, ...userWithoutPassword } = result.rows[0];
    res.status(201).json(userWithoutPassword);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    // role: "student" hoặc "teacher" (nếu frontend truyền lên)
    let role_id: number | undefined = undefined;
    if (role === "teacher") role_id = 2;
    if (role === "student") role_id = 1;
    let result;
    if (role_id) {
      result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND role_id = $2",
        [email, role_id]
      );
    } else {
      result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
    }
    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
      return;
    }
    const userRole = user.role_id === 2 ? "teacher" : "student";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        role: userRole,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role_id: user.role_id,
        role: userRole,
      },
    });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, name, email, avatar, role_id FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy user" });
      return;
    }
    const user = result.rows[0];
    const userWithRole = {
      ...user,
      role: user.role_id === 2 ? "teacher" : "student",
    };
    res.json({ user: userWithRole });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};
