import pool from "../config/db";

export interface ExamResultInsert {
  submission_id: number;
  score: number;
  auto_graded?: boolean;
}

export interface ExamResultUpdate {
  score?: number;
  auto_graded?: boolean;
}

export const getAllResults = async () => {
  const res = await pool.query("SELECT * FROM exam_results");
  return res.rows;
};

export const getResultById = async (id: number) => {
  const res = await pool.query("SELECT * FROM exam_results WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

export const getResultsBySubmissionId = async (submission_id: number) => {
  const res = await pool.query(
    "SELECT * FROM exam_results WHERE submission_id = $1",
    [submission_id]
  );
  return res.rows;
};

export const createResult = async (result: ExamResultInsert) => {
  const { submission_id, score, auto_graded } = result;
  const res = await pool.query(
    "INSERT INTO exam_results (submission_id, score, auto_graded) VALUES ($1, $2, $3) RETURNING *",
    [submission_id, score, auto_graded !== undefined ? auto_graded : true]
  );
  return res.rows[0];
};

export const updateResult = async (id: number, result: ExamResultUpdate) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in result) {
    const typedKey = key as keyof ExamResultUpdate;
    if (result[typedKey] !== undefined && result[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(result[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query("SELECT * FROM exam_results WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE exam_results SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteResult = async (id: number) => {
  await pool.query("DELETE FROM exam_results WHERE id = $1", [id]);
};
