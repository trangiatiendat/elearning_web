import pool from "../config/db";

export interface AssignmentSubmissionInsert {
  assignment_id: number;
  student_id: number;
  file_url: string;
}

export interface AssignmentSubmissionUpdate {
  file_url?: string;
  grade?: number;
  feedback?: string;
}

export const getAllSubmissions = async () => {
  const res = await pool.query("SELECT * FROM assignment_submissions");
  return res.rows;
};

export const getSubmissionById = async (id: number) => {
  const res = await pool.query(
    "SELECT * FROM assignment_submissions WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

export const getSubmissionsByAssignmentId = async (assignment_id: number) => {
  const res = await pool.query(
    "SELECT * FROM assignment_submissions WHERE assignment_id = $1",
    [assignment_id]
  );
  return res.rows;
};

export const createSubmission = async (
  submission: AssignmentSubmissionInsert
) => {
  const { assignment_id, student_id, file_url } = submission;
  const res = await pool.query(
    "INSERT INTO assignment_submissions (assignment_id, student_id, file_url) VALUES ($1, $2, $3) RETURNING *",
    [assignment_id, student_id, file_url]
  );
  return res.rows[0];
};

export const updateSubmission = async (
  id: number,
  submission: AssignmentSubmissionUpdate
) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in submission) {
    const typedKey = key as keyof AssignmentSubmissionUpdate;
    if (submission[typedKey] !== undefined && submission[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(submission[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query(
      "SELECT * FROM assignment_submissions WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE assignment_submissions SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteSubmission = async (id: number) => {
  await pool.query("DELETE FROM assignment_submissions WHERE id = $1", [id]);
};
