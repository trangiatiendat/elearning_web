import pool from "../config/db";
import { Request, Response } from "express";

export interface StudentCourse {
  id: number;
  student_id: number;
  course_id: number;
  registered_at: Date;
}

export const registerCourse = async (
  student_id: number,
  course_id: number
): Promise<StudentCourse> => {
  const res = await pool.query(
    `INSERT INTO student_courses (student_id, course_id)
     VALUES ($1, $2)
     ON CONFLICT (student_id, course_id) DO NOTHING
     RETURNING *`,
    [student_id, course_id]
  );
  return res.rows[0];
};

export const isRegistered = async (
  student_id: number,
  course_id: number
): Promise<boolean> => {
  const res = await pool.query(
    `SELECT 1 FROM student_courses WHERE student_id = $1 AND course_id = $2`,
    [student_id, course_id]
  );
  return (res.rowCount ?? 0) > 0;
};

export async function getRegisteredCourses(studentId: number) {
  console.log(
    "[DEBUG][MODEL] getRegisteredCourses studentId:",
    studentId,
    typeof studentId
  );
  if (!studentId || isNaN(studentId)) {
    throw new Error("studentId is invalid: " + studentId);
  }
  try {
    const res = await pool.query(
      `SELECT c.*, sc.registered_at, u.name AS teacher_name
     FROM student_courses sc
     JOIN courses c ON sc.course_id = c.id
     JOIN users u ON c.teacher_id = u.id
     WHERE sc.student_id = $1
     ORDER BY sc.registered_at DESC`,
      [studentId]
    );
    return res.rows;
  } catch (err) {
    console.error("[getRegisteredCourses] Lỗi:", err, JSON.stringify(err));
    throw err;
  }
}

export async function getUnregisteredCourses(studentId: number) {
  if (!studentId || isNaN(studentId)) {
    throw new Error("studentId is invalid: " + studentId);
  }
  const courses = await pool.query(
    `SELECT c.*, u.name AS teacher_name
     FROM courses c
     JOIN users u ON c.teacher_id = u.id
     WHERE c.id NOT IN (
       SELECT course_id FROM student_courses WHERE student_id = $1
     )`,
    [studentId]
  );
  return courses.rows;
}

export const getRegisteredCoursesForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    console.log("[DEBUG][CONTROLLER] user:", user, typeof user?.id);
    if (!user || typeof user.id !== "number" || isNaN(user.id)) {
      return res
        .status(401)
        .json({ error: "Bạn chưa đăng nhập hoặc token không hợp lệ" });
    }
    const studentId = user.id;
    const courses = await getRegisteredCourses(studentId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi server",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
};

export async function getStudentsByCourseId(courseId: number) {
  const res = await pool.query(
    `SELECT u.id, u.name, u.email, sc.registered_at
     FROM student_courses sc
     JOIN users u ON sc.student_id = u.id
     WHERE sc.course_id = $1
     ORDER BY u.name ASC`,
    [courseId]
  );
  return res.rows;
}
