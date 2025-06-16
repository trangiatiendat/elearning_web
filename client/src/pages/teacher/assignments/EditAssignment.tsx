import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import axios from "axios";
import {
  getTeacherCourses,
  getTopicsByCourseId,
} from "../../../services/courseService";
import { Course } from "../../../types/course";
import { getAssignmentById } from "../../../services/assignmentService";
import AssignmentForm from "../../../components/teacher/assignments/AssignmentForm";
import { useAssignmentForm } from "../../../hooks/assignments/useAssignmentForm";

const EditAssignment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const menu = useTeacherMenu();
  const { teacher, loading: teacherLoading } = useTeacher();

  // State quản lý dữ liệu
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [assignmentLoaded, setAssignmentLoaded] = useState(false);
  const [originalTopicId, setOriginalTopicId] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  // Custom hook quản lý form
  const onSubmit = async (form: any, file: File | null) => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("due_date", form.dueDate);
    formData.append("topic_id", String(form.topicId));
    if (file) formData.append("attachment", file);
    await axios.put(`http://localhost:5000/api/assignments/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {}),
      },
    });
    setSuccess(true);
    setTimeout(() => navigate("/teacher/assignments"), 1200);
  };

  const {
    form,
    setForm,
    file,
    handleChange,
    handleFileChange,
    handleSubmit,
    loading,
    error,
    setError,
    errors,
  } = useAssignmentForm({
    initialForm: {
      courseId: 0,
      topicId: 0,
      title: "",
      description: "",
      dueDate: "",
    },
    onSubmit,
  });

  // Lấy thông tin assignment khi vào trang
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await getAssignmentById(Number(id));
          const dueDate = data.dueDate
            ? new Date(data.dueDate).toISOString().slice(0, 16)
            : "";
          setForm({
            ...data,
            dueDate,
          });
          setOriginalTopicId(data.topicId);
          setAssignmentLoaded(true);
        } catch (e) {
          setError("Không thể tải dữ liệu bài tập.");
        }
      })();
    }
  }, [id, setForm, setError]);

  // Lấy danh sách khóa học
  useEffect(() => {
    if (teacher?.id) {
      (async () => {
        try {
          const data = await getTeacherCourses();
          setCourses(data);
          setCoursesLoaded(true);
        } catch (e) {
          setCourses([]);
          setCoursesLoaded(true);
        }
      })();
    }
  }, [teacher?.id]);

  // Effect to set assignmentLoaded only after both assignment and courses are fetched
  useEffect(() => {
    if (form.title && coursesLoaded) {
      setAssignmentLoaded(true);
    }
  }, [form.title, coursesLoaded]);

  // Lấy danh sách chủ đề khi courseId thay đổi
  useEffect(() => {
    if (form.courseId) {
      (async () => {
        try {
          const data = await getTopicsByCourseId(Number(form.courseId));
          setTopics(data);
        } catch (e) {
          setTopics([]);
        }
      })();
    } else {
      setTopics([]);
    }
    setForm((prev: any) => ({ ...prev, topicId: 0 }));
  }, [form.courseId, setForm]);

  // Sau khi topics đã load và assignment đã load, nếu originalTopicId có trong topics, set lại topicId cho form
  useEffect(() => {
    if (
      assignmentLoaded &&
      topics.length > 0 &&
      originalTopicId &&
      topics.some((t: any) => t.id === originalTopicId)
    ) {
      setForm((prev: any) => ({ ...prev, topicId: originalTopicId }));
    }
  }, [topics, assignmentLoaded, originalTopicId, setForm]);

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
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Sửa bài tập</h1>
        {assignmentLoaded && coursesLoaded ? (
          <AssignmentForm
            form={form}
            errors={errors}
            file={file}
            loading={loading}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            courses={courses}
            topics={topics}
            isEdit={true}
          />
        ) : (
          <div className="text-center text-gray-500">
            Đang tải dữ liệu bài tập...
          </div>
        )}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && (
          <div className="text-green-600 mb-2">
            Cập nhật bài tập thành công!
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditAssignment;
