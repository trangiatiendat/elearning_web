import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeLayout from "../layouts/HomeLayout";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const role_id = role === "teacher" ? 2 : 1;
      await axios.post("/api/auth/signup", { name, email, password, role_id });
      setSuccess("Đăng ký thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Đăng ký thất bại");
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
            Đăng ký tài khoản
          </h2>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center font-semibold">
              {success}
            </div>
          )}
          <input
            type="text"
            placeholder="Họ tên"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Đăng ký
          </button>
          <div className="text-center text-sm mt-2">
            Đã có tài khoản?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Đăng nhập
            </a>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Signup;
