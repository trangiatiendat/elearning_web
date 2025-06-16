import dotenv from "dotenv";

// Load biến môi trường từ file .env
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "default_secret_key_not_for_production",
  expiresIn: "7d", // Token hết hạn sau 7 ngày
};
