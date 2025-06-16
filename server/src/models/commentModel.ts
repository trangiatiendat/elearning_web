import pool from "../config/db";

export interface CommentInsert {
  material_id: number;
  user_id: number;
  content: string;
}

export const getAllComments = async () => {
  const res = await pool.query("SELECT * FROM comments");
  return res.rows;
};

export const getCommentById = async (id: number) => {
  const res = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
  return res.rows[0];
};

export const getCommentsByMaterialId = async (material_id: number) => {
  const res = await pool.query(
    "SELECT * FROM comments WHERE material_id = $1",
    [material_id]
  );
  return res.rows;
};

export const createComment = async (comment: CommentInsert) => {
  const { material_id, user_id, content } = comment;
  const res = await pool.query(
    "INSERT INTO comments (material_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [material_id, user_id, content]
  );
  return res.rows[0];
};

export const updateComment = async (id: number, content: string) => {
  const res = await pool.query(
    "UPDATE comments SET content = $1 WHERE id = $2 RETURNING *",
    [content, id]
  );
  return res.rows[0];
};

export const deleteComment = async (id: number) => {
  await pool.query("DELETE FROM comments WHERE id = $1", [id]);
};
