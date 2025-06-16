import { useState, useEffect } from "react";
import studentService from "../services/studentService";
import { StudentProfile } from "../types/student";

const CACHE_KEY = "student_profile";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useStudent = () => {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (e) {}
    }
    return null;
  });
  const [loading, setLoading] = useState(!student);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const data = await studentService.getProfile();
      setStudent(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
      setError(null);
    } catch (err: any) {
      setError("Không thể tải thông tin học sinh");
      console.error("Error fetching student profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const updateProfile = async (data: Partial<StudentProfile>) => {
    try {
      setLoading(true);
      const updatedData = await studentService.updateProfile(data);
      setStudent(updatedData);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: updatedData, timestamp: Date.now() })
      );
      setError(null);
      return true;
    } catch (err) {
      setError("Không thể cập nhật thông tin");
      console.error("Error updating student profile:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      setLoading(true);
      const { avatar } = await studentService.updateAvatar(file);
      const updatedStudent = student ? { ...student, avatar } : null;
      setStudent(updatedStudent);
      if (updatedStudent) {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: updatedStudent, timestamp: Date.now() })
        );
      }
      setError(null);
      return true;
    } catch (err) {
      setError("Không thể cập nhật ảnh đại diện");
      console.error("Error updating student avatar:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  return {
    student,
    loading,
    error,
    updateProfile,
    updateAvatar,
    refetch: () => {
      clearCache();
      return fetchStudentProfile();
    },
  };
};

export default useStudent;
