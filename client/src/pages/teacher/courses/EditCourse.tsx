import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../../services/courseService";
import { CourseFormData } from "../../../types/course";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import axios from "axios";

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<CourseFormData>({
    name: "",
    description: "",
    image_url: "",
    password: "",
    topics: [],
  });
  const navigate = useNavigate();
  const menu = useTeacherMenu();
  const { teacher, loading: teacherLoading } = useTeacher();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (id) {
          const data = await getCourseById(Number(id));
          setForm({
            name: data.name,
            description: data.description,
            image_url: data.image_url || "",
            password: data.password || "",
            topics: data.topics || [],
          });
        }
      } catch (err) {
        alert("Không tìm thấy khóa học!");
        navigate("/teacher/courses/manage");
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        const formDataToSend = new FormData();
        formDataToSend.append("name", form.name);
        formDataToSend.append("description", form.description);
        formDataToSend.append("password", form.password);
        formDataToSend.append("topics", JSON.stringify(form.topics));
        if (selectedImage) {
          formDataToSend.append("image", selectedImage);
        } else if (form.image_url) {
          formDataToSend.append("image_url", form.image_url);
        }
        await axios.put(`/api/courses/teacher/${id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Cập nhật thành công!");
        navigate("/teacher/courses/manage");
      }
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  const displayName = teacherLoading
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";

  return (
    <DashboardLayout
      role="teacher"
      name={displayName}
      menu={menu}
      avatar={teacher?.avatar}
      userInfo={{
        name: displayName,
        role: "Giáo viên",
        email: teacher?.email,
        avatar: teacher?.avatar,
      }}
    >
      <form onSubmit={handleSubmit} className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sửa khóa học</h1>
        <div className="mb-4">
          <label className="block mb-1">Tên khóa học</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Ảnh khóa học</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border px-4 py-2 rounded w-full"
          />
          {(imagePreview || form.image_url) && (
            <div className="mt-2">
              <img
                src={imagePreview || form.image_url}
                alt="Ảnh khóa học"
                className="h-32 rounded shadow border object-cover"
                style={{ maxWidth: 240 }}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mật khẩu khóa học</label>
          <input
            type="text"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
            required
          />
        </div>
        {/* Có thể thêm sửa topic ở đây */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Lưu thay đổi
        </button>
      </form>
    </DashboardLayout>
  );
};

export default EditCourse;
