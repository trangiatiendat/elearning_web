import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  role_id: number;
  role: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Không tìm thấy token" });
    return;
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as UserPayload;
    const idNum = Number(user.id);
    if (!idNum || isNaN(idNum)) {
      res.status(401).json({ error: "Token không hợp lệ (id)" });
      return;
    }
    (req as any).user = { ...user, id: idNum };
    next();
  } catch (err) {
    res.status(403).json({ error: "Token không hợp lệ" });
  }
};

export const requireTeacher = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ error: "Chưa xác thực" });
    return;
  }

  if (user.role_id !== 2) {
    res.status(403).json({ error: "Chỉ giáo viên mới có quyền truy cập" });
    return;
  }

  next();
};

export const requireStudent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ error: "Chưa xác thực" });
    return;
  }
  if (!(user.role === "student" || user.role_id === 1)) {
    res.status(403).json({ error: "Chỉ học sinh mới có quyền truy cập" });
    return;
  }
  next();
};
