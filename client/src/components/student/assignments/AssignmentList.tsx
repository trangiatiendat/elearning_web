import React, { useEffect, useState } from "react";
import {
  ClockIcon,
  DocumentTextIcon,
  PaperClipIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  getAssignmentsByStudent,
  submitAssignment,
} from "../../../services/assignmentService";
import { Assignment as AssignmentType } from "../../../types/assignment";
import useStudent from "../../../hooks/useStudent";
import { useNavigate } from "react-router-dom";

interface AssignmentListProps {
  filter: "all" | "submitted" | "pending";
  assignments?: AssignmentType[];
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  filter,
  assignments: propAssignments,
}) => {
  const {
    student,
    loading: studentLoading,
    error: studentError,
  } = useStudent();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<AssignmentType[]>(
    propAssignments || []
  );
  const [loading, setLoading] = useState(!propAssignments);
  const [error, setError] = useState<string | null>(null);
  const [openSubmitId, setOpenSubmitId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (propAssignments) {
      setAssignments(propAssignments);
      setLoading(false);
      return;
    }
    const fetchAssignments = async () => {
      if (studentLoading) return;
      if (studentError) {
        setError(`Không thể tải thông tin học sinh: ${studentError}`);
        setLoading(false);
        return;
      }
      if (!student?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const studentId = Number(student.id);
        const data = await getAssignmentsByStudent(studentId);
        setAssignments(data);
      } catch (e: any) {
        setError("Lỗi khi tải bài tập: " + e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [student, studentLoading, studentError, propAssignments]);

  const getStatusColor = (status: AssignmentType["status"] | undefined) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "graded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "all") return true;
    if (filter === "submitted") return assignment.status === "submitted";
    if (filter === "pending")
      return assignment.status === "pending" || assignment.status === undefined;
    return false;
  });

  const handleOpenSubmit = (assignmentId: number) => {
    setOpenSubmitId(assignmentId === openSubmitId ? null : assignmentId);
    setUploadError(null);
    setUploadSuccess(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent, assignmentId: number) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Vui lòng chọn file để nộp bài.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const updatedAssignment = await submitAssignment(
        assignmentId,
        selectedFile
      );
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === assignmentId ? updatedAssignment : assignment
        )
      );
      setUploadSuccess("Nộp bài thành công!");
      setOpenSubmitId(null);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err.message || "Nộp bài thất bại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center text-gray-400 py-12 text-lg">
          Đang tải bài tập...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12 text-lg">
          Lỗi: {error}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-lg">
          Không có bài tập nào được giao hoặc không phù hợp với bộ lọc.
        </div>
      ) : (
        filteredAssignments.map((assignment: AssignmentType) => (
          <div
            key={assignment.id}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-200 overflow-hidden"
          >
            <div className="p-4 pb-2 flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-2">
                <DocumentTextIcon className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                <h2 className="text-2xl font-bold text-indigo-900 flex-1">
                  {assignment.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {assignment.status === "pending"
                    ? "Chưa nộp"
                    : assignment.status === "submitted"
                    ? "Đã nộp"
                    : assignment.status === "graded"
                    ? "Đã chấm điểm"
                    : "Khác"}
                </span>
              </div>
              <div className="text-gray-700 text-base mb-2 leading-relaxed">
                {assignment.description}
              </div>
              <div className="flex flex-wrap gap-4 items-center text-base">
                {assignment.attachment_url && (
                  <a
                    href={assignment.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1 text-indigo-600 hover:underline text-base font-medium"
                  >
                    <PaperClipIcon className="h-5 w-5 mr-1" />
                    File bài tập
                  </a>
                )}
                {assignment.dueDate && (
                  <div className="flex items-center gap-1 text-base text-gray-500">
                    <ClockIcon className="h-5 w-5 mr-1 text-pink-500" />
                    <span>
                      Hạn nộp:{" "}
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                )}
                {assignment.status === "graded" &&
                  assignment.score !== undefined && (
                    <div className="flex items-center gap-1 text-base text-green-600 font-semibold">
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      <span>Điểm: {assignment.score}/10</span>
                    </div>
                  )}
              </div>
              {/* Display submission info if submitted or graded (moved Edit button)*/}
              {(assignment.status === "submitted" ||
                assignment.status === "graded") && (
                <div className="mt-2 text-base text-gray-600">
                  {assignment.submission_file_url && (
                    <div className="flex items-center gap-1 text-base">
                      <PaperClipIcon className="h-5 w-5 text-blue-500" />
                      <span>File đã nộp: </span>
                      <a
                        href={assignment.submission_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="text-indigo-600 hover:underline text-base"
                      >
                        Tải xuống
                      </a>
                    </div>
                  )}
                  {assignment.submitted_at && (
                    <div className="flex items-center gap-1 mt-1 text-base text-gray-500">
                      <ClockIcon className="h-5 w-5 text-gray-500" />
                      <span>
                        Thời gian nộp:{" "}
                        {new Date(assignment.submitted_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {assignment.status === "graded" &&
                    assignment.submission_grade !== undefined &&
                    assignment.submission_grade !== null && (
                      <div className="flex items-center gap-1 mt-1 text-base text-green-600 font-semibold">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Điểm: {assignment.submission_grade}/10</span>
                      </div>
                    )}
                  {assignment.status === "graded" &&
                    assignment.submission_feedback && (
                      <div className="mt-1 text-base text-gray-700">
                        <span>Feedback: {assignment.submission_feedback}</span>
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex flex-wrap gap-3">
                {assignment.status === "pending" && (
                  <button
                    className="px-3 py-1.5 text-sm border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                    onClick={() => handleOpenSubmit(assignment.id)}
                  >
                    Nộp bài
                  </button>
                )}
                {/* Add Edit Submission Button */}
                {assignment.status === "submitted" && (
                  <button
                    className="px-3 py-1.5 text-sm border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                    onClick={() => handleOpenSubmit(assignment.id)}
                  >
                    Chỉnh sửa bài nộp
                  </button>
                )}
              </div>
              {openSubmitId === assignment.id && (
                <form
                  className="mt-4 flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-indigo-200 shadow-inner"
                  onSubmit={(e) => handleSubmit(e, assignment.id)}
                >
                  <label className="block">
                    <span className="sr-only">Choose file</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-700
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-100 file:text-indigo-700
                        hover:file:bg-indigo-200
                      "
                    />
                  </label>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={uploading || !selectedFile}
                    >
                      {uploading ? "Đang nộp..." : "Xác nhận nộp"}
                    </button>
                  </div>
                  {uploadError && (
                    <div className="text-red-600 text-sm">{uploadError}</div>
                  )}
                  {uploadSuccess && (
                    <div className="text-green-600 text-sm">
                      {uploadSuccess}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignmentList;
