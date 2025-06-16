import pool from "../config/db";

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role_id?: number;
  date_of_birth?: string;
}

export const getAllUsers = async () => {
  const res = await pool.query("SELECT * FROM users");
  return res.rows;
};

export const getUserById = async (id: number) => {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
};

export const createUser = async (user: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role_id: number;
  date_of_birth?: string;
}) => {
  const { name, email, password, avatar, role_id, date_of_birth } = user;
  const res = await pool.query(
    "INSERT INTO users (name, email, password, avatar, role_id, date_of_birth) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, email, password, avatar || null, role_id, date_of_birth || null]
  );
  return res.rows[0];
};

export const updateUser = async (id: number, user: UserUpdate) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in user) {
    const typedKey = key as keyof UserUpdate;
    if (user[typedKey] !== undefined && user[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(user[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteUser = async (id: number) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

export const getUserByEmailAndRole = async (email: string, role_id: number) => {
  const res = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND role_id = $2",
    [email, role_id]
  );
  return res.rows[0];
};
