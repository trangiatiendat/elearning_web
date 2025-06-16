import pool from "../config/db";

export interface CreateLogDTO {
  user_id: number;
  action: string;
  details?: string;
}

export const getAllLogs = async () => {
  const res = await pool.query("SELECT * FROM history_logs");
  return res.rows;
};

export const getLogById = async (id: number) => {
  const res = await pool.query("SELECT * FROM history_logs WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

export const getLogsByUserId = async (user_id: number) => {
  const res = await pool.query(
    "SELECT * FROM history_logs WHERE user_id = $1",
    [user_id]
  );
  return res.rows;
};

export const createLog = async (log: CreateLogDTO) => {
  const { user_id, action, details } = log;
  const res = await pool.query(
    "INSERT INTO history_logs (user_id, action, details) VALUES ($1, $2, $3) RETURNING *",
    [user_id, action, details || null]
  );
  return res.rows[0];
};

export const deleteLog = async (id: number) => {
  await pool.query("DELETE FROM history_logs WHERE id = $1", [id]);
};
