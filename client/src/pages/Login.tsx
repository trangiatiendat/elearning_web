import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeLayout from "../layouts/HomeLayout";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
        role,
      });

      if (!res.data.token || !res.data.user) {
        setError("Đăng nhập thất bại - Không nhận được thông tin user");
        return;
      }

      // Xác định role của user từ database
      const userRole = res.data.user.role_id === 2 ? "teacher" : "student";

      // Kiểm tra xem role được chọn có khớp với role trong database không
      if (role !== userRole) {
        setError(`Bạn không có quyền đăng nhập với vai trò ${role}`);
        return;
      }

      // Lưu token và thông tin user
      localStorage.setItem("token", res.data.token);
      localStorage.removeItem("user");
      if (userRole === "teacher") {
        localStorage.setItem(
          "teacher_profile",
          JSON.stringify({
            ...res.data.user,
            role: userRole, // Đảm bảo lưu đúng role
          })
        );
      } else {
        localStorage.setItem(
          "student_profile",
          JSON.stringify({
            ...res.data.user,
            role: userRole, // Đảm bảo lưu đúng role
          })
        );
      }

      // Điều hướng dựa trên role
      const dashboardPath =
        userRole === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
      console.log("Đăng nhập thành công, chuyển hướng đến:", dashboardPath);
      navigate(dashboardPath, { replace: true });
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-screen flex justify-center bg-gradient-to-br from-indigo-100 to-pink-100 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4 my-auto"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
            Đăng nhập
          </h2>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Học sinh</option>
            <option value="teacher">Giáo viên</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-pink-500 text-white font-semibold py-2 rounded-lg transition"
          >
            Đăng nhập
          </button>
          <div className="text-center text-sm mt-2">
            Chưa có tài khoản?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Đăng ký ngay
            </a>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Login;
