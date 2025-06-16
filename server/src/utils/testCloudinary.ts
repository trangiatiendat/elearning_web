import dotenv from "dotenv";
dotenv.config();

import cloudinary from "../config/cloudinary";

cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("Cloudinary connection failed:", error);
  } else {
    console.log("Cloudinary connection successful:", result);
  }
});
