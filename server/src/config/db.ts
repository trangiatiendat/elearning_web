import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "elearning_db",
  password: process.env.PGPASSWORD || "tgtd31102003",
  port: Number(process.env.PGPORT) || 5432,
});

export default pool;
