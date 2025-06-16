import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = async (
  filePath: string,
  resourceType: "image" | "video" | "auto" = "auto",
  folder: string = "uploads"
): Promise<UploadApiResponse> => {
  return await cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    folder,
  });
};
