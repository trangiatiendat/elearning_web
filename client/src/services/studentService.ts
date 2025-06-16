import axios from "axios";

interface StudentProfile {
  name: string;
  email: string;
  avatar?: string;
  class?: string;
  school?: string;
  phone?: string;
  bio?: string;
}

// Add authorization header to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const studentService = {
  // Lấy thông tin profile của học sinh
  getProfile: async (): Promise<StudentProfile> => {
    try {
      const response = await axios.get("/api/student/profile", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching student profile:", error);
      throw error;
    }
  },

  // Cập nhật thông tin profile của học sinh
  updateProfile: async (
    data: Partial<StudentProfile>
  ): Promise<StudentProfile> => {
    try {
      const response = await axios.put("/api/student/profile", data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating student profile:", error);
      throw error;
    }
  },

  // Cập nhật ảnh đại diện của học sinh
  updateAvatar: async (file: File): Promise<{ avatar: string }> => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.put("/api/student/avatar", formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating student avatar:", error);
      throw error;
    }
  },
};

export default studentService;
