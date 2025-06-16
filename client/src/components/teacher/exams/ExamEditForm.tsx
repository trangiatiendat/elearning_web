import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ExamEditFormProps {
  initial: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}

const ExamEditForm: React.FC<ExamEditFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [form, setForm] = useState(initial);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-yellow-50 rounded-xl p-6 mb-6 shadow flex flex-col gap-4 mt-4 max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-yellow-700">Sửa đề thi</span>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-red-500"
        >
          <FaTimes />
        </button>
      </div>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Tên đề thi"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Mô tả"
      />
      <input
        name="duration_minutes"
        type="number"
        value={form.duration_minutes}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Thời lượng (phút)"
        required
      />
      <input
        name="start_time"
        type="datetime-local"
        value={form.start_time?.slice(0, 16) || ""}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Thời gian bắt đầu"
        required
      />
      <input
        name="end_time"
        type="datetime-local"
        value={form.end_time?.slice(0, 16) || ""}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Thời gian kết thúc"
        required
      />
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 self-end"
        disabled={loading}
      >
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
};

export default ExamEditForm;
