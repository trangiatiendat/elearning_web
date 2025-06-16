import axios from "axios";
import { Exam, ExamForm } from "../types/exam";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createExam = async (data: ExamForm): Promise<Exam> => {
  const response = await api.post("/exams", data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return response.data;
};

export const getExamsByCourseId = async (courseId: number): Promise<Exam[]> => {
  const response = await api.get(`/exams/by-course/${courseId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getExamDetail = async (id: number): Promise<Exam> => {
  const response = await api.get(`/exams/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getAllExams = async (): Promise<Exam[]> => {
  const response = await api.get("/exams", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createQuestion = async (data: any) => {
  const response = await api.post("/exam-questions", data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return response.data;
};

export const updateExam = async (id: number, data: any) => {
  const response = await api.put(`/exams/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return response.data;
};

export const deleteExam = async (id: number) => {
  const response = await api.delete(`/exams/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateQuestion = async (id: number, data: any) => {
  const response = await api.put(`/exam-questions/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return response.data;
};

export const deleteQuestion = async (id: number) => {
  const response = await api.delete(`/exam-questions/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getMyExamResults = async () => {
  const response = await api.get("/exam-results/my", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getExamResultsByExamId = async (examId: number) => {
  const response = await api.get(`/exam-results/by-exam/${examId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getStudentExams = async (): Promise<Exam[]> => {
  const response = await api.get("/exams/student/my-exams", {
    headers: getAuthHeader(),
  });
  return response.data;
};
