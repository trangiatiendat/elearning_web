import pool from "../config/db";

export interface ExamInsert {
  course_id: number;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
}

export interface ExamUpdate {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
}

export const getAllExams = async () => {
  const res = await pool.query(`
    SELECT exams.*, courses.name AS course_name
    FROM exams
    LEFT JOIN courses ON exams.course_id = courses.id
  `);
  return res.rows;
};

export const getExamById = async (id: number) => {
  const res = await pool.query("SELECT * FROM exams WHERE id = $1", [id]);
  return res.rows[0];
};

export const getExamsByCourseId = async (course_id: number) => {
  const res = await pool.query("SELECT * FROM exams WHERE course_id = $1", [
    course_id,
  ]);
  return res.rows;
};

export const getExamsByTeacherId = async (teacher_id: number) => {
  const res = await pool.query(
    `
    SELECT exams.*, courses.name AS course_name
    FROM exams
    JOIN courses ON exams.course_id = courses.id
    WHERE courses.teacher_id = $1
    ORDER BY exams.start_time DESC
  `,
    [teacher_id]
  );
  return res.rows;
};

export const getExamsByStudentId = async (student_id: number) => {
  const res = await pool.query(
    `
    SELECT exams.*, courses.name AS course_name
    FROM exams
    JOIN courses ON exams.course_id = courses.id
    JOIN student_courses sc ON courses.id = sc.course_id
    WHERE sc.student_id = $1
    ORDER BY exams.start_time DESC
  `,
    [student_id]
  );
  return res.rows;
};

export const createExam = async (exam: ExamInsert) => {
  const {
    course_id,
    title,
    description,
    start_time,
    end_time,
    duration_minutes,
  } = exam;
  const res = await pool.query(
    "INSERT INTO exams (course_id, title, description, start_time, end_time, duration_minutes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      course_id,
      title,
      description || null,
      start_time || null,
      end_time || null,
      duration_minutes || null,
    ]
  );
  return res.rows[0];
};

export const updateExam = async (id: number, exam: ExamUpdate) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in exam) {
    const typedKey = key as keyof ExamUpdate;
    if (exam[typedKey] !== undefined && exam[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(exam[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query("SELECT * FROM exams WHERE id = $1", [id]);
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE exams SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteExam = async (id: number) => {
  await pool.query("DELETE FROM exams WHERE id = $1", [id]);
};
