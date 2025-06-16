import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import courseRouter from "./routes/course/courseRouter";
import authRouter from "./routes/authRouter";
import teacherRouter from "./routes/teacherRouter";
import path from "path";
import courseTopicRoutes from "./routes/course/courseTopicRoutes";
import courseMaterialRoutes from "./routes/course/courseMaterialRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import studentRouter from "./routes/studentRouter";
import examRoutes from "./routes/examRoutes";
import examQuestionRoutes from "./routes/examQuestionRoutes";
import examResultRoutes from "./routes/examResultRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/courses", courseRouter);
app.use("/api/auth", authRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/course-topics", courseTopicRoutes);
app.use("/api/course-materials", courseMaterialRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/student", studentRouter);
app.use("/api/exams", examRoutes);
app.use("/api/exam-questions", examQuestionRoutes);
app.use("/api/exam-results", examResultRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to E-Learning API" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
