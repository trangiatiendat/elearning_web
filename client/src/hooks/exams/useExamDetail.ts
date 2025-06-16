import { useState, useEffect } from "react";
import {
  getExamDetail,
  updateExam,
  deleteExam,
  updateQuestion,
  deleteQuestion,
  createQuestion,
} from "../../services/examService";

export function useExamDetail(id: string | undefined) {
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [form, setForm] = useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });
  const [formError, setFormError] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [showEditExamForm, setShowEditExamForm] = useState(false);
  const [editExamForm, setEditExamForm] = useState<any>(null);
  const [editExamError, setEditExamError] = useState("");
  const [loadingEditExam, setLoadingEditExam] = useState(false);

  const reloadExam = async () => {
    if (id) {
      setLoading(true);
      const data = await getExamDetail(Number(id));
      setExam(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadExam();
    // eslint-disable-next-line
  }, [id]);

  // Handler: mở form thêm câu hỏi
  const openAddForm = () => {
    setEditQuestion(null);
    setForm({
      question_text: "",
      options: ["", "", "", ""],
      correct_answer: "",
    });
    setShowForm(true);
  };

  // Handler: mở form sửa câu hỏi
  const openEditForm = (q: any) => {
    setEditQuestion(q);
    setForm({
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
    });
    setShowForm(true);
  };

  // Handler: đóng form câu hỏi
  const closeForm = () => {
    setShowForm(false);
    setEditQuestion(null);
    setFormError("");
  };

  // Handler: thay đổi input trong form câu hỏi
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler: thay đổi option trong form câu hỏi
  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[idx] = value;
    setForm({ ...form, options: newOptions });
  };

  // Handler: submit form câu hỏi
  const handleFormSubmit = async (formData: any) => {
    setLoadingForm(true);
    setFormError("");
    try {
      if (editQuestion) {
        await updateQuestion(editQuestion.id, formData);
        setExam((prev: any) => ({
          ...prev,
          questions: prev.questions.map((q: any) =>
            q.id === editQuestion.id ? { ...q, ...formData } : q
          ),
        }));
      } else {
        const newQ = await createQuestion({
          exam_id: Number(id),
          ...formData,
        });
        setExam((prev: any) => ({
          ...prev,
          questions: [...prev.questions, newQ],
        }));
      }
      closeForm();
    } catch (err) {
      setFormError("Không thể lưu câu hỏi");
    } finally {
      setLoadingForm(false);
    }
  };

  // Handler: mở form sửa đề thi
  const openEditExamForm = () => {
    setEditExamForm({
      title: exam.title,
      description: exam.description,
      duration_minutes: exam.duration_minutes,
      start_time: exam.start_time,
      end_time: exam.end_time,
    });
    setShowEditExamForm(true);
  };

  // Handler: đóng form sửa đề thi
  const closeEditExamForm = () => {
    setShowEditExamForm(false);
    setEditExamError("");
  };

  // Handler: thay đổi input trong form sửa đề thi
  const handleEditExamFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditExamForm({ ...editExamForm, [e.target.name]: e.target.value });
  };

  // Handler: submit form sửa đề thi
  const handleEditExamSubmit = async (formData: any) => {
    setLoadingEditExam(true);
    setEditExamError("");
    try {
      await updateExam(exam.id, formData);
      reloadExam();
      closeEditExamForm();
    } catch (err) {
      setEditExamError("Không thể lưu thay đổi đề thi");
    } finally {
      setLoadingEditExam(false);
    }
  };

  // Handler: xóa đề thi
  const handleDeleteExam = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) {
      await deleteExam(exam.id);
      window.location.href = "/teacher/exams";
    }
  };

  // Handler: xóa câu hỏi
  const handleDeleteQuestion = async (qid: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      await deleteQuestion(qid);
      reloadExam();
    }
  };

  return {
    exam,
    setExam,
    loading,
    showForm,
    setShowForm,
    editQuestion,
    setEditQuestion,
    form,
    setForm,
    formError,
    setFormError,
    loadingForm,
    setLoadingForm,
    showEditExamForm,
    setShowEditExamForm,
    editExamForm,
    setEditExamForm,
    editExamError,
    setEditExamError,
    loadingEditExam,
    setLoadingEditExam,
    reloadExam,
    // Thêm các handler mới
    openAddForm,
    openEditForm,
    closeForm,
    handleFormChange,
    handleOptionChange,
    handleFormSubmit,
    openEditExamForm,
    closeEditExamForm,
    handleEditExamFormChange,
    handleEditExamSubmit,
    handleDeleteExam,
    handleDeleteQuestion,
  };
}
