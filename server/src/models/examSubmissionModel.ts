import pool from "../config/db";

export interface ExamSubmissionInsert {
  exam_id: number;
  student_id: number;
  answers: any;
}

export interface ExamSubmissionUpdate {
  answers?: any;
}

export const getAllSubmissions = async () => {
  const res = await pool.query("SELECT * FROM exam_submissions");
  return res.rows;
};

export const getSubmissionById = async (id: number) => {
  const res = await pool.query("SELECT * FROM exam_submissions WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

export const getSubmissionsByExamId = async (exam_id: number) => {
  const res = await pool.query(
    "SELECT * FROM exam_submissions WHERE exam_id = $1",
    [exam_id]
  );
  return res.rows;
};

export const createSubmission = async (submission: ExamSubmissionInsert) => {
  const { exam_id, student_id, answers } = submission;
  const res = await pool.query(
    "INSERT INTO exam_submissions (exam_id, student_id, answers) VALUES ($1, $2, $3) RETURNING *",
    [exam_id, student_id, answers]
  );
  return res.rows[0];
};

export const updateSubmission = async (
  id: number,
  submission: ExamSubmissionUpdate
) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in submission) {
    const typedKey = key as keyof ExamSubmissionUpdate;
    if (submission[typedKey] !== undefined && submission[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(submission[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query(
      "SELECT * FROM exam_submissions WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE exam_submissions SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteSubmission = async (id: number) => {
  await pool.query("DELETE FROM exam_submissions WHERE id = $1", [id]);
};
