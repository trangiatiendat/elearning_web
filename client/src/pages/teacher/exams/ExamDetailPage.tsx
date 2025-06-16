import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import QuestionCard from "../../../components/teacher/exams/QuestionCard";
import QuestionForm from "../../../components/teacher/exams/QuestionForm";
import ExamEditForm from "../../../components/teacher/exams/ExamEditForm";
import { useExamDetail } from "../../../hooks/exams/useExamDetail";

const ExamDetailPage: React.FC = () => {
  const menu = useTeacherMenu();
  const { teacher, loading: loadingTeacher } = useTeacher();
  const displayName = loadingTeacher
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";
  const { id } = useParams<{ id: string }>();

  const {
    exam,
    showForm,
    editQuestion,
    form,
    formError,
    loadingForm,
    showEditExamForm,
    editExamForm,
    editExamError,
    loadingEditExam,
    openAddForm,
    openEditForm,
    closeForm,
    handleFormSubmit,
    openEditExamForm,
    closeEditExamForm,
    handleEditExamSubmit,
    handleDeleteExam,
    handleDeleteQuestion,
  } = useExamDetail(id);

  if (!exam) return <div>Đang tải...</div>;

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
      <div className="p-10 max-w-5xl mx-auto">
        {/* Thông tin kiểm tra nổi bật */}
        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl shadow-lg p-10 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              {exam.title}
            </h1>
            <div className="text-base text-gray-700 mb-2">
              {exam.description}
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-700">
              <span className="inline-flex items-center gap-2 bg-white rounded-lg px-5 py-2 shadow-md">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {exam.duration_minutes} phút
              </span>
              <span className="inline-flex items-center gap-2 bg-white rounded-lg px-5 py-2 shadow-md">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {exam.start_time
                  ? new Date(exam.start_time).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour12: false,
                    })
                  : ""}
                {" đến "}
                {exam.end_time
                  ? new Date(exam.end_time).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour12: false,
                    })
                  : ""}
              </span>
              <span className="inline-flex items-center gap-2 bg-white rounded-lg px-5 py-2 shadow-md">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {exam.questions.length} câu hỏi
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600"
              onClick={openEditExamForm}
              title="Sửa đề thi"
            >
              <FaEdit />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600"
              onClick={handleDeleteExam}
              title="Xóa đề thi"
            >
              <FaTrash />
            </button>
          </div>
        </div>
        {/* Hiển thị form sửa đề thi nếu showEditExamForm - Đặt lên đầu trang */}
        {showEditExamForm && (
          <ExamEditForm
            initial={editExamForm}
            onSubmit={handleEditExamSubmit}
            onCancel={closeEditExamForm}
            loading={loadingEditExam}
            error={editExamError}
          />
        )}
        {/* Danh sách câu hỏi */}
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-green-700">
              Danh sách câu hỏi
            </h2>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 text-green-700 text-lg"
              onClick={openAddForm}
              title="Thêm câu hỏi"
            >
              <FaPlus />
            </button>
          </div>
          {showForm && (
            <QuestionForm
              initial={form}
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
              loading={loadingForm}
              error={formError}
              editQuestion={editQuestion}
              questionsCount={
                editQuestion
                  ? exam.questions.findIndex(
                      (q: any) => q.id === editQuestion.id
                    ) + 1
                  : exam.questions.length
              }
            />
          )}
          <div className="grid grid-cols-1 gap-6">
            {exam.questions.map((q: any, idx: number) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                onEdit={() => openEditForm(q)}
                onDelete={() => handleDeleteQuestion(q.id)}
              />
            ))}
            {exam.questions.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12 text-base">
                Chưa có câu hỏi nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamDetailPage;
