import { useState, useEffect } from "react";
import { getTeacherCourses } from "../../services/courseService";
import { createExam } from "../../services/examService";
import { ExamForm } from "../../types/exam";
import { useNavigate, useLocation } from "react-router-dom";

export function useExamCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const courseId = params.get("courseId") || "";

  const [form, setForm] = useState<ExamForm>({
    title: "",
    description: "",
    duration_minutes: 45,
    start_time: "",
    end_time: "",
    course_id: courseId,
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getTeacherCourses();
        setCourses(data);
      } catch (e) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");
    try {
      await createExam({ ...form, course_id: Number(form.course_id) });
      alert("Tạo kiểm tra thành công!");
      navigate(`/teacher/exams`);
    } catch (err) {
      setError("Không thể tạo kiểm tra");
    } finally {
      setLoadingForm(false);
    }
  };

  return {
    form,
    setForm,
    loadingForm,
    error,
    courses,
    handleChange,
    handleSubmit,
  };
}
