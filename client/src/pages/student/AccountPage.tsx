import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useStudentMenu } from "../../components/student/menuStudent";
import useStudent from "../../hooks/useStudent";
import axios from "axios";

const AccountPage: React.FC = () => {
  const menu = useStudentMenu();
  const { student, loading, refetch } = useStudent();

  // Local state cho form
  const [form, setForm] = useState({
    name: student?.name || "",
    email: student?.email || "",
    date_of_birth: student?.date_of_birth || "",
    createdAt: student?.createdAt || "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    student?.avatar
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Cập nhật lại form khi student thay đổi
  useEffect(() => {
    if (student) {
      console.log("Student data:", student);
      setForm({
        name: student.name || "",
        email: student.email || "",
        date_of_birth: student.date_of_birth || "",
        createdAt: student.createdAt || student.created_at || "",
      });
      setAvatarPreview(student.avatar);
    }
  }, [student]);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý chọn ảnh mới
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Hàm upload ảnh lên Cloudinary
  async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // Thay bằng preset của bạn
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      formData
    );
    return res.data.secure_url;
  }

  // Hàm gọi API backend cập nhật avatar
  async function updateStudentAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    await axios.put("/api/student/avatar", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        await updateStudentAvatar(avatarFile);
        if (typeof refetch === "function") {
          await refetch();
        } else {
          window.location.reload();
        }
      }
      // Có thể gọi API cập nhật profile nếu muốn
      // ...
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      role="student"
      name={student?.name || "Học sinh"}
      menu={menu}
      avatar={student?.avatar}
      userInfo={{
        name: student?.name || "Học sinh",
        role: "Học sinh",
        email: student?.email,
        avatar: student?.avatar,
      }}
    >
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl border border-indigo-100">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Tài khoản</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân</p>
          </div>
          <div className="p-0">
            <div className="max-w-2xl mx-auto">
              {/* Profile Picture */}
              <div className="mb-8 flex items-center gap-6 justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={form.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
                  />
                ) : (
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-medium">
                    {form.name.charAt(0)}
                  </div>
                )}
                <div>
                  <label className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer">
                    Thay đổi ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={
                        form.date_of_birth
                          ? form.date_of_birth.slice(0, 10)
                          : ""
                      }
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày tạo tài khoản
                    </label>
                    <input
                      type="text"
                      name="createdAt"
                      value={
                        form.createdAt
                          ? new Date(form.createdAt).toLocaleDateString("vi-VN")
                          : ""
                      }
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
                {/* Đổi mật khẩu: có thể bổ sung sau */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountPage;
