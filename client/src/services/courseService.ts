import axios from "axios";
import { Course, CourseFormData } from "../types/course";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await api.get("/courses", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getCourseById = async (id: number): Promise<Course> => {
  const response = await api.get(`/courses/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createCourse = async (
  data: CourseFormData & { teacher_id: number }
): Promise<Course> => {
  const response = await api.post("/courses/teacher", data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return response.data;
};

export const updateCourse = async (
  id: number,
  data: Partial<CourseFormData>
): Promise<Course> => {
  const response = await api.put(`/courses/teacher/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return response.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await api.delete(`/courses/teacher/${id}`, {
    headers: getAuthHeader(),
  });
};

export const searchCourses = async (searchTerm: string): Promise<Course[]> => {
  const response = await api.get("/courses/search", {
    params: { q: searchTerm },
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getTeacherCourses = async (): Promise<Course[]> => {
  const response = await api.get(`/courses/teacher/courses`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get("/courses", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getTopicsByCourseId = async (courseId: number) => {
  const response = await api.get(`/course-topics?courseId=${courseId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getRegisteredCourses = async (): Promise<Course[]> => {
  const response = await api.get("/courses/student/registered", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getUnregisteredCourses = async (): Promise<Course[]> => {
  const response = await api.get("/courses/student/unregistered", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const registerCourse = async (course_id: number, password: string) => {
  const response = await api.post(
    `/courses/student/${course_id}/register`,
    { password },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getStudentsByCourseId = async (courseId: number) => {
  const response = await api.get(`/courses/teacher/${courseId}/students`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export default api;
