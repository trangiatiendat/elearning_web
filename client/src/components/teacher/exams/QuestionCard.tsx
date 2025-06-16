import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface QuestionCardProps {
  question: any;
  index: number;
  onEdit: (q: any) => void;
  onDelete: (id: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onEdit,
  onDelete,
}) => (
  <div className="border-l-4 border-green-500 bg-green-50 rounded-xl p-4 shadow flex flex-col gap-2 relative">
    <div className="absolute top-2 right-2 flex gap-2">
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600"
        onClick={() => onEdit(question)}
        title="Sửa câu hỏi"
      >
        <FaEdit />
      </button>
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600"
        onClick={() => onDelete(question.id)}
        title="Xóa câu hỏi"
      >
        <FaTrash />
      </button>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-bold text-green-700">Câu {index + 1}:</span>
      <span className="text-gray-900 font-semibold">
        {question.question_text}
      </span>
    </div>
    <div className="grid grid-cols-1 gap-1 ml-6">
      {question.options.map((opt: string, i: number) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
            opt === question.correct_answer
              ? "bg-green-200 text-green-900 font-bold"
              : "bg-white text-gray-700"
          }`}
        >
          <span className="font-bold text-base">
            {String.fromCharCode(65 + i)}.
          </span>
          <span>{opt}</span>
          {opt === question.correct_answer && (
            <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-semibold">
              Đáp án đúng
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default QuestionCard;
