import dotenv from "dotenv";
import { jwtConfig } from "./jwt.config";

dotenv.config();

export const config = {
  jwt: jwtConfig,
  // Có thể thêm các config khác ở đây như:
  // database: dbConfig,
  // redis: redisConfig,
  // email: emailConfig,
  // ...
};
