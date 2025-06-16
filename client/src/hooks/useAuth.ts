import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher";
  role_id?: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Khởi tạo state từ localStorage
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return { user, loading: false };
      } catch {
        return { user: null, loading: true };
      }
    }
    return { user: null, loading: true };
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthState({ user: null, loading: false });
        return;
      }

      try {
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user;
        // Cập nhật user trong localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        setAuthState({ user: userData, loading: false });
      } catch (error) {
        console.error("Auth check failed:", error);
        // Chỉ xóa token nếu lỗi 401/403
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        setAuthState({ user: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({ user: null, loading: false });
  };

  return {
    user: authState.user,
    loading: authState.loading,
    isAuthenticated: !!authState.user,
    logout,
  };
};

export default useAuth;
