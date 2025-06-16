import pool from "../config/db";

export interface ExamRegistrationInsert {
  exam_id: number;
  student_id: number;
  is_verified?: boolean;
}

export interface ExamRegistrationUpdate {
  is_verified?: boolean;
}

export const getAllRegistrations = async () => {
  const res = await pool.query("SELECT * FROM exam_registrations");
  return res.rows;
};

export const getRegistrationById = async (id: number) => {
  const res = await pool.query(
    "SELECT * FROM exam_registrations WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

export const getRegistrationsByExamId = async (exam_id: number) => {
  const res = await pool.query(
    "SELECT * FROM exam_registrations WHERE exam_id = $1",
    [exam_id]
  );
  return res.rows;
};

export const createRegistration = async (
  registration: ExamRegistrationInsert
) => {
  const { exam_id, student_id, is_verified } = registration;
  const res = await pool.query(
    "INSERT INTO exam_registrations (exam_id, student_id, is_verified) VALUES ($1, $2, $3) RETURNING *",
    [exam_id, student_id, is_verified || false]
  );
  return res.rows[0];
};

export const updateRegistration = async (
  id: number,
  registration: ExamRegistrationUpdate
) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in registration) {
    const typedKey = key as keyof ExamRegistrationUpdate;
    if (
      registration[typedKey] !== undefined &&
      registration[typedKey] !== null
    ) {
      fields.push(`${key} = $${idx}`);
      values.push(registration[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query(
      "SELECT * FROM exam_registrations WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE exam_registrations SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteRegistration = async (id: number) => {
  await pool.query("DELETE FROM exam_registrations WHERE id = $1", [id]);
};
