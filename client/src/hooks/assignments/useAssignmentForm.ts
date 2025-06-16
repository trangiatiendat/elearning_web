import { useState } from "react";
import { CreateAssignmentDTO } from "../../types/assignment";

export function useAssignmentForm({
  initialForm,
  onSubmit,
}: {
  initialForm: CreateAssignmentDTO;
  onSubmit: (form: CreateAssignmentDTO, file: File | null) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateAssignmentDTO>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // Nếu là select cho courseId hoặc topicId thì convert về number
    if (name === "courseId" || name === "topicId") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.courseId) newErrors.courseId = "Vui lòng chọn khóa học";
    if (!form.topicId) newErrors.topicId = "Vui lòng chọn chủ đề";
    if (!form.title?.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!form.description?.trim())
      newErrors.description = "Vui lòng nhập mô tả";
    if (!form.dueDate) newErrors.dueDate = "Vui lòng chọn hạn nộp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      await onSubmit(form, file);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi gửi dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    file,
    setFile,
    handleChange,
    handleFileChange,
    handleSubmit,
    loading,
    error,
    setError,
    errors,
    setErrors,
    validateForm,
  };
}
