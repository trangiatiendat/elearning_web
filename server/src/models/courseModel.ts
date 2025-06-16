import pool from "../config/db";

export interface Course {
  id: number;
  name: string;
  description?: string;
  teacher_id: number;
  created_at: Date;
  password: string;
  image_url?: string;
}

export interface Topic {
  title: string;
  description?: string;
}

export interface CreateCourseDTO {
  name: string;
  description?: string;
  teacher_id: number;
  password: string;
  image_url?: string;
  topics?: Topic[];
}

export interface UpdateCourseDTO {
  name?: string;
  description?: string;
  teacher_id?: number;
  password?: string;
  image_url?: string;
}

export const getAllCourses = async (): Promise<Course[]> => {
  const res = await pool.query(
    "SELECT * FROM courses ORDER BY created_at DESC"
  );
  return res.rows;
};

export const getCourseById = async (id: number): Promise<Course | null> => {
  const res = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  return res.rows[0] || null;
};

export const getCoursesByTeacherId = async (
  teacherId: number
): Promise<Course[]> => {
  try {
    const res = await pool.query(
      "SELECT * FROM courses WHERE teacher_id = $1 ORDER BY created_at DESC",
      [teacherId]
    );
    return res.rows;
  } catch (err) {
    console.error("[getCoursesByTeacherId][DB]", err, JSON.stringify(err));
    throw err;
  }
};

export const createCourse = async (
  course: CreateCourseDTO
): Promise<Course> => {
  const { name, description, teacher_id, password, image_url } = course;
  const res = await pool.query(
    `INSERT INTO courses (name, description, teacher_id, created_at, password, image_url)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)
     RETURNING *`,
    [name, description || null, teacher_id, password, image_url || null]
  );
  return res.rows[0];
};

export const updateCourse = async (
  id: number,
  course: UpdateCourseDTO
): Promise<Course | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;
  for (const key in course) {
    const typedKey = key as keyof UpdateCourseDTO;
    if (course[typedKey] !== undefined && course[typedKey] !== null) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(course[typedKey]);
      paramIndex++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    return res.rows[0] || null;
  }
  values.push(id);
  const query = `
    UPDATE courses
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  const res = await pool.query(query, values);
  return res.rows[0] || null;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM courses WHERE id = $1", [id]);
};

export const searchCourses = async (searchTerm: string): Promise<Course[]> => {
  const res = await pool.query(
    `SELECT * FROM courses 
     WHERE name ILIKE $1 OR description ILIKE $1 
     ORDER BY created_at DESC`,
    [`%${searchTerm}%`]
  );
  return res.rows;
};
