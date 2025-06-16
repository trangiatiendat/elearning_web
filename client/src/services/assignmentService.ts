import axios from "axios";
import {
  Assignment,
  CreateAssignmentDTO,
  UpdateAssignmentDTO,
} from "../types/assignment";
import { CourseWithAssignmentsAndSubmissions } from "../types/teacherAssignmentTypes";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAssignments = async (): Promise<Assignment[]> => {
  const response = await api.get("/assignments/teacher", {
    headers: getAuthHeader(),
  });
  return response.data.map((a: any) => ({
    ...a,
    dueDate: a.dueDate || a.due_date,
    courseName: a.courseName || a.course_name,
    topicTitle: a.topicTitle || a.topic_title,
    courseId: a.courseId || a.course_id,
    topicId: a.topicId || a.topic_id,
  }));
};

export const createAssignment = async (formData: FormData) => {
  const response = await api.post("/assignments", formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateAssignment = async (
  id: number,
  data: FormData
): Promise<Assignment> => {
  const response = await api.put(`/assignments/${id}`, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteAssignment = async (id: number): Promise<void> => {
  await api.delete(`/assignments/${id}`, {
    headers: getAuthHeader(),
  });
};

export const getAssignmentById = async (id: number): Promise<Assignment> => {
  const response = await api.get(`/assignments/${id}`, {
    headers: getAuthHeader(),
  });
  const a = response.data;
  return {
    ...a,
    dueDate: a.dueDate || a.due_date,
    courseName: a.courseName || a.course_name,
    topicTitle: a.topicTitle || a.topic_title,
    courseId: a.courseId || a.course_id,
    topicId: a.topicId || a.topic_id,
  };
};

export const getTopicsByCourseId = async (courseId: number) => {
  const response = await api.get(`/course-topics?courseId=${courseId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Function to get assignments by student ID
export const getAssignmentsByStudent = async (
  studentId: number
): Promise<Assignment[]> => {
  const response = await api.get(`/student/assignments`, {
    headers: getAuthHeader(),
  });
  return response.data.map((a: any) => ({
    ...a,
    dueDate: a.dueDate || a.due_date,
    courseName: a.courseName || a.course_name,
    topicTitle: a.topicTitle || a.topic_title,
    courseId: a.courseId || a.course_id,
    topicId: a.topicId || a.topic_id,
    status: a.status, // Assuming status is returned by backend
    score: a.score, // Assuming score is returned by backend
  }));
};

// Lấy bài tập của học sinh, có thể lọc theo courseId
export const getStudentAssignments = async (courseId?: number) => {
  const params = courseId ? { courseId } : {};
  const response = await api.get("/student/assignments", {
    headers: getAuthHeader(),
    params,
  });
  return response.data.map((a: any) => ({
    ...a,
    dueDate: a.dueDate || a.due_date,
    courseName: a.courseName || a.course_name,
    topicTitle: a.topicTitle || a.topic_title,
    courseId: a.courseId || a.course_id,
    topicId: a.topicId || a.topic_id,
    status: a.status,
    score: a.score,
  }));
};

// Nộp bài cho học sinh
export const submitAssignment = async (assignmentId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(
    `/assignments/${assignmentId}/submit`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Get courses, assignments, and student submissions for a teacher
export const getCourseAssignmentsAndSubmissionsForTeacher = async (
  teacherId: number
): Promise<CourseWithAssignmentsAndSubmissions[]> => {
  const response = await api.get("/assignments/teacher/submissions", {
    headers: getAuthHeader(),
    params: { teacherId },
  });
  return response.data;
};
