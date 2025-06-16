import pool from "../config/db";

export interface CourseTopicInsert {
  course_id: number;
  title: string;
  description?: string;
}

export interface CourseTopicUpdate {
  title?: string;
  description?: string;
}

export const getAllTopics = async () => {
  const res = await pool.query("SELECT * FROM course_topics");
  return res.rows;
};

export const getTopicById = async (id: number) => {
  const res = await pool.query("SELECT * FROM course_topics WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

export const getTopicsByCourseId = async (course_id: number) => {
  const res = await pool.query(
    "SELECT * FROM course_topics WHERE course_id = $1",
    [course_id]
  );
  return res.rows;
};

export const createTopic = async (topic: CourseTopicInsert) => {
  const { course_id, title, description } = topic;
  const res = await pool.query(
    "INSERT INTO course_topics (course_id, title, description) VALUES ($1, $2, $3) RETURNING *",
    [course_id, title, description || null]
  );
  return res.rows[0];
};

export const updateTopic = async (id: number, topic: CourseTopicUpdate) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in topic) {
    const typedKey = key as keyof CourseTopicUpdate;
    if (topic[typedKey] !== undefined && topic[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(topic[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query("SELECT * FROM course_topics WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE course_topics SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteTopic = async (id: number) => {
  await pool.query("DELETE FROM course_topics WHERE id = $1", [id]);
};
