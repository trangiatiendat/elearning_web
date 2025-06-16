import axios from "axios";

interface TeacherProfile {
  name: string;
  email: string;
  avatar?: string;
  specialization?: string;
  phone?: string;
  bio?: string;
}

// Add authorization header to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const teacherService = {
  // Lấy thông tin profile của giáo viên
  getProfile: async (): Promise<TeacherProfile> => {
    try {
      const response = await axios.get("/api/teacher/profile", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      throw error;
    }
  },

  // Cập nhật thông tin profile của giáo viên
  updateProfile: async (
    data: Partial<TeacherProfile>
  ): Promise<TeacherProfile> => {
    try {
      const response = await axios.put("/api/teacher/profile", data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating teacher profile:", error);
      throw error;
    }
  },

  // Cập nhật ảnh đại diện của giáo viên
  updateAvatar: async (file: File): Promise<{ avatar: string }> => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.put("/api/teacher/avatar", formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating teacher avatar:", error);
      throw error;
    }
  },
};

export default teacherService;
