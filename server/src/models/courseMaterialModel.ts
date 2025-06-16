import pool from "../config/db";

interface CourseMaterial {
  id: number;
  topic_id: number;
  type: string;
  title: string;
  url: string;
  uploaded_at: Date;
}

export const getAllMaterials = async () => {
  const res = await pool.query("SELECT * FROM course_materials");
  return res.rows;
};

export const getMaterialById = async (id: number) => {
  const res = await pool.query("SELECT * FROM course_materials WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

export const getMaterialsByTopicId = async (topic_id: number) => {
  const res = await pool.query(
    "SELECT * FROM course_materials WHERE topic_id = $1",
    [topic_id]
  );
  return res.rows;
};

export const createMaterial = async (material: {
  topic_id: number;
  type: string;
  title: string;
  url: string;
}) => {
  const { topic_id, type, title, url } = material;
  const res = await pool.query(
    "INSERT INTO course_materials (topic_id, type, title, url, uploaded_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
    [topic_id, type, title, url]
  );
  return res.rows[0];
};

export const updateMaterial = async (
  id: number,
  material: { type?: string; title?: string; url?: string }
) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in material) {
    fields.push(`${key} = $${idx}`);
    values.push((material as any)[key]);
    idx++;
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE course_materials SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteMaterial = async (id: number) => {
  await pool.query("DELETE FROM course_materials WHERE id = $1", [id]);
};
