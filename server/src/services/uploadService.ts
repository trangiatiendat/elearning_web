import multer from "multer";
import path from "path";
import fs from "fs";

// Cấu hình thư mục lưu file
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Cấu hình Multer để lưu file tạm trong bộ nhớ
const memoryStorage = multer.memoryStorage();

// Kiểm tra loại file
const allowedTypes = [
  "application/pdf",
  "video/mp4",
  "video/webm",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/webp",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.ms-powerpoint", // .ppt
  "text/csv", // .csv
  "application/zip", // .zip
  "application/x-rar-compressed", // .rar
];

const fileFilter = (req: any, file: any, cb: any) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Không hỗ trợ định dạng file này"), false);
  }
};

// Cấu hình giới hạn file
const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

// Export Multer middleware with memory storage for Cloudinary uploads
export const uploadMemory = multer({
  storage: memoryStorage,
  fileFilter: fileFilter, // Vẫn dùng fileFilter để kiểm tra định dạng
  limits: limits, // Vẫn dùng giới hạn kích thước
});

// Xóa file
export const deleteFile = (filename: string) => {
  const filepath = path.join(uploadDir, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};

// Lấy đường dẫn file
export const getFileUrl = (filename: string) => {
  return `/uploads/${filename}`;
};
