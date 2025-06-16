import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../components/teacher/menuTeacher";
import useTeacher from "../../hooks/useTeacher";

const AccountPage: React.FC = () => {
  const menu = useTeacherMenu();
  const { teacher, loading, refetch } = useTeacher();

  // Local state cho form
  const [form, setForm] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
    date_of_birth: teacher?.date_of_birth || "",
    createdAt: teacher?.createdAt || "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    teacher?.avatar
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (teacher) {
      // Debug log
      console.log("Teacher data:", teacher);
      setForm({
        name: teacher.name || "",
        email: teacher.email || "",
        date_of_birth: teacher.date_of_birth || "",
        createdAt: (teacher as any).created_at || teacher.createdAt || "",
      });
      setAvatarPreview(teacher.avatar);
    }
  }, [teacher]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Dummy submit (bạn có thể thay bằng API thực tế)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Gọi API cập nhật thông tin giáo viên và avatar nếu cần
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <DashboardLayout
      role="teacher"
      name={teacher?.name || "Giáo viên"}
      menu={menu}
      avatar={teacher?.avatar}
      userInfo={{
        name: teacher?.name || "Giáo viên",
        role: "Giáo viên",
        email: teacher?.email,
        avatar: teacher?.avatar,
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
