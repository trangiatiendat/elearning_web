import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import { createAssignment } from "../../../services/assignmentService";
import { CreateAssignmentDTO } from "../../../types/assignment";
import AssignmentForm from "../../../components/teacher/assignments/AssignmentForm";
import { useAssignmentForm } from "../../../hooks/assignments/useAssignmentForm";
import { getTeacherCourses } from "../../../services/courseService";
import { getTopicsByCourseId } from "../../../services/assignmentService";

const initialForm: CreateAssignmentDTO = {
  title: "",
  description: "",
  dueDate: "",
  courseId: 0,
  topicId: 0,
};

const CreateAssignment = () => {
  const navigate = useNavigate();
  const menu = useTeacherMenu();
  const { teacher, loading: teacherLoading } = useTeacher();
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  const displayName = teacherLoading
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";

  const onSubmit = async (form: CreateAssignmentDTO, file: File | null) => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("due_date", form.dueDate);
    formData.append("courseId", String(form.courseId));
    formData.append("topic_id", String(form.topicId));
    if (file) formData.append("attachment", file);
    await createAssignment(formData);
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
    errors,
  } = useAssignmentForm({ initialForm, onSubmit });

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getTeacherCourses();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (form.courseId) {
      (async () => {
        try {
          const data = await getTopicsByCourseId(Number(form.courseId));
          setTopics(data);
        } catch {
          setTopics([]);
        }
      })();
    } else {
      setTopics([]);
    }
    setForm((prev) => ({ ...prev, topicId: 0 }));
  }, [form.courseId, setForm]);

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
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Tạo bài tập mới
        </h1>
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
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && (
          <div className="text-green-600 mb-2">Tạo bài tập thành công!</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateAssignment;
