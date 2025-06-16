import React from "react";
import { CreateAssignmentDTO } from "../../../types/assignment";

interface AssignmentFormProps {
  form: CreateAssignmentDTO;
  errors: any;
  file: File | null;
  loading: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  courses: any[];
  topics: any[];
  isEdit?: boolean;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  form,
  errors,
  loading,
  onChange,
  onFileChange,
  onSubmit,
  courses,
  topics,
  isEdit,
}) => (
  <form
    onSubmit={onSubmit}
    className="space-y-5 bg-white p-8 rounded-xl shadow"
  >
    <div>
      <label className="block mb-1 font-medium">Khóa học</label>
      <select
        name="courseId"
        value={form.courseId}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
        required
      >
        <option value="">Chọn khóa học</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {errors.courseId && (
        <div className="text-red-600 text-sm mt-1">{errors.courseId}</div>
      )}
    </div>
    <div>
      <label className="block mb-1 font-medium">Chủ đề</label>
      <select
        name="topicId"
        value={form.topicId}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        required
        disabled={!form.courseId}
      >
        <option value="">Chọn chủ đề</option>
        {topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
      {errors.topicId && (
        <div className="text-red-600 text-sm mt-1">{errors.topicId}</div>
      )}
    </div>
    <div>
      <label className="block mb-1 font-medium">Tiêu đề bài tập</label>
      <input
        name="title"
        value={form.title}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
        required
      />
      {errors.title && (
        <div className="text-red-600 text-sm mt-1">{errors.title}</div>
      )}
    </div>
    <div>
      <label className="block mb-1 font-medium">Mô tả</label>
      <textarea
        name="description"
        value={form.description}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
        required
      />
      {errors.description && (
        <div className="text-red-600 text-sm mt-1">{errors.description}</div>
      )}
    </div>
    <div>
      <label className="block mb-1 font-medium">Hạn nộp</label>
      <input
        type="datetime-local"
        name="dueDate"
        value={form.dueDate}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
        required
      />
      {errors.dueDate && (
        <div className="text-red-600 text-sm mt-1">{errors.dueDate}</div>
      )}
    </div>
    <div>
      <label className="block mb-1 font-medium">File đính kèm (tùy chọn)</label>
      <input
        type="file"
        name="attachment"
        onChange={onFileChange}
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition duration-200 ease-in-out"
        accept="*"
      />
    </div>
    {(form as any).attachment_url && (
      <div className="mb-2">
        <a
          href={(form as any).attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Tải file hiện tại
        </a>
      </div>
    )}
    <div className="flex justify-end gap-2">
      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {isEdit
          ? loading
            ? "Đang lưu..."
            : "Lưu thay đổi"
          : loading
          ? "Đang tạo..."
          : "Tạo bài tập"}
      </button>
    </div>
  </form>
);

export default AssignmentForm;
