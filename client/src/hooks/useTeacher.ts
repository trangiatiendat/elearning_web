import { useState, useEffect } from "react";
import teacherService from "../services/teacherService";
import { TeacherProfile } from "../types/teacher";

const CACHE_KEY = "teacher_profile";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useTeacher = () => {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(() => {
    // Try to get cached data first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is still valid (within 5 minutes)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (e) {
        // Invalid cache, ignore
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(!teacher);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we don't have cached data
    if (!teacher) {
      fetchTeacherProfile();
    }
  }, []); // Only run on mount

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getProfile();
      setTeacher(data);
      // Cache the data with timestamp
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
      setError(null);
    } catch (err: any) {
      console.error("Error fetching teacher profile:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Không thể tải thông tin giáo viên");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<TeacherProfile>) => {
    try {
      setLoading(true);
      const updatedData = await teacherService.updateProfile(data);
      setTeacher(updatedData);
      // Update cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: updatedData,
          timestamp: Date.now(),
        })
      );
      setError(null);
      return true;
    } catch (err) {
      setError("Không thể cập nhật thông tin");
      console.error("Error updating teacher profile:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      setLoading(true);
      const { avatar } = await teacherService.updateAvatar(file);
      const updatedTeacher = teacher ? { ...teacher, avatar } : null;
      setTeacher(updatedTeacher);
      if (updatedTeacher) {
        // Update cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: updatedTeacher,
            timestamp: Date.now(),
          })
        );
      }
      setError(null);
      return true;
    } catch (err) {
      setError("Không thể cập nhật ảnh đại diện");
      console.error("Error updating teacher avatar:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  return {
    teacher,
    loading,
    error,
    updateProfile,
    updateAvatar,
    refetch: () => {
      clearCache();
      return fetchTeacherProfile();
    },
  };
};

export default useTeacher;
