import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface QuestionFormProps {
  initial: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
  editQuestion: any;
  questionsCount: number;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  loading,
  error,
  editQuestion,
  questionsCount,
}) => {
  const [form, setForm] = useState(initial);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[idx] = value;
    setForm({ ...form, options: newOptions });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-green-50 rounded-xl p-6 mb-8 shadow flex flex-col gap-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-green-700">
          {editQuestion
            ? `Sửa Câu ${questionsCount}`
            : `Câu ${questionsCount + 1}`}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-red-500"
        >
          <FaTimes />
        </button>
      </div>
      <textarea
        name="question_text"
        value={form.question_text}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Nội dung câu hỏi"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {form.options.map((opt: string, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-6">{String.fromCharCode(65 + idx)}.</span>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
              required
            />
          </div>
        ))}
      </div>
      <select
        name="correct_answer"
        value={form.correct_answer}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      >
        <option value="">-- Chọn đáp án đúng --</option>
        {form.options.map((opt: string, idx: number) => (
          <option key={idx} value={opt} disabled={!opt}>
            {String.fromCharCode(65 + idx)}. {opt}
          </option>
        ))}
      </select>
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 self-end"
        disabled={loading}
      >
        {loading
          ? "Đang lưu..."
          : editQuestion
          ? "Lưu thay đổi"
          : "Thêm câu hỏi"}
      </button>
    </form>
  );
};

export default QuestionForm;
