import pool from "./db";

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("Kết nối thành công! Thời gian:", res.rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Lỗi kết nối:", err);
    process.exit(1);
  });
