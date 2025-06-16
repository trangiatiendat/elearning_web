import pool from "../config/db";

export interface ExamQuestionInsert {
  exam_id: number;
  question_text: string;
  question_type: string;
  options?: any;
  correct_answer?: string;
}

export interface ExamQuestionUpdate {
  question_text?: string;
  question_type?: string;
  options?: any;
  correct_answer?: string;
}

export const getAllQuestions = async () => {
  const res = await pool.query("SELECT * FROM exam_questions");
  return res.rows;
};

export const getQuestionById = async (id: number) => {
  const res = await pool.query("SELECT * FROM exam_questions WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

export const getQuestionsByExamId = async (exam_id: number) => {
  const res = await pool.query(
    "SELECT * FROM exam_questions WHERE exam_id = $1",
    [exam_id]
  );
  return res.rows;
};

export const createQuestion = async (question: ExamQuestionInsert) => {
  const { exam_id, question_text, question_type, options, correct_answer } =
    question;
  const res = await pool.query(
    "INSERT INTO exam_questions (exam_id, question_text, question_type, options, correct_answer) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      exam_id,
      question_text,
      question_type,
      options ? JSON.stringify(options) : null,
      correct_answer || null,
    ]
  );
  return res.rows[0];
};

export const updateQuestion = async (
  id: number,
  question: ExamQuestionUpdate
) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in question) {
    const typedKey = key as keyof ExamQuestionUpdate;
    if (question[typedKey] !== undefined && question[typedKey] !== null) {
      if (key === "options") {
        fields.push(`${key} = $${idx}`);
        values.push(JSON.stringify(question[typedKey]));
      } else {
        fields.push(`${key} = $${idx}`);
        values.push(question[typedKey]);
      }
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query("SELECT * FROM exam_questions WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE exam_questions SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteQuestion = async (id: number) => {
  await pool.query("DELETE FROM exam_questions WHERE id = $1", [id]);
};
