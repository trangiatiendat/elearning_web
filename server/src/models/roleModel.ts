import pool from "../config/db";

export interface RoleInsert {
  name: string;
}

export interface RoleUpdate {
  name: string;
}

export const getAllRoles = async () => {
  const res = await pool.query("SELECT * FROM roles");
  return res.rows;
};

export const getRoleById = async (id: number) => {
  const res = await pool.query("SELECT * FROM roles WHERE id = $1", [id]);
  return res.rows[0];
};

export const createRole = async (role: RoleInsert) => {
  const { name } = role;
  const res = await pool.query(
    "INSERT INTO roles (name) VALUES ($1) RETURNING *",
    [name]
  );
  return res.rows[0];
};

export const updateRole = async (id: number, role: RoleUpdate) => {
  const { name } = role;
  const res = await pool.query(
    "UPDATE roles SET name = $1 WHERE id = $2 RETURNING *",
    [name, id]
  );
  return res.rows[0];
};

export const deleteRole = async (id: number) => {
  await pool.query("DELETE FROM roles WHERE id = $1", [id]);
};
