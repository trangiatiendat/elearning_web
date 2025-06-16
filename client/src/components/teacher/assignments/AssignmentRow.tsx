import React from "react";
import { Assignment } from "../../../types/assignment";

interface AssignmentRowProps {
  assignment: Assignment;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { hour12: false });
};

const AssignmentRow: React.FC<AssignmentRowProps> = ({
  assignment,
  onEdit,
  onDelete,
}) => (
  <div className="py-4">
    <div className="flex w-full items-stretch">
      <div className="flex-1 min-w-0 px-3">
        <h3 className="text-sm font-medium text-gray-900">
          {assignment.title}
        </h3>
        <p className="text-sm text-gray-500">{assignment.description}</p>
      </div>
      <div className="flex-grow-0 flex-shrink-0 basis-32 min-w-0 text-center px-3">
        <span className="text-sm text-gray-900 truncate">
          {assignment.courseName ||
            (assignment as any).course_name ||
            assignment.courseId}
        </span>
      </div>
      <div className="flex-grow-0 flex-shrink-0 basis-32 min-w-0 text-center px-3">
        <span className="text-sm text-gray-900 max-w-[160px] whitespace-normal break-words inline-block">
          {assignment.topicTitle ||
            (assignment as any).topic_title ||
            assignment.topicId}
        </span>
      </div>
      <div className="flex-grow-0 flex-shrink-0 basis-24 min-w-0 text-center px-3">
        <span className="text-sm text-gray-900">
          {assignment.dueDate ? formatDate(assignment.dueDate) : ""}
        </span>
      </div>
      <div className="flex-grow-0 flex-shrink-0 basis-28 min-w-0 text-center px-3">
        <span className="text-sm text-gray-900">
          {assignment.created_at ? formatDate(assignment.created_at) : ""}
        </span>
      </div>
      <div className="flex-grow-0 flex-shrink-0 basis-32 min-w-0 text-center px-3">
        {assignment.attachment_url ? (
          <a
            href={assignment.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline truncate"
          >
            Tải file
          </a>
        ) : (
          <span className="text-gray-400">Không có</span>
        )}
      </div>
      <div className="flex-grow-0 flex-shrink-0 basis-28 min-w-0 text-center px-3">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onEdit(assignment.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Sửa"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(assignment.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AssignmentRow;
