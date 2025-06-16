import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import { useNavigate } from "react-router-dom";
import { useExamList } from "../../../hooks/exams/useExamList";

const statusMap: Record<string, string> = {
  upcoming: "Sắp diễn ra",
  ongoing: "Đang diễn ra",
  completed: "Đã kết thúc",
};
const statusColor: Record<string, string> = {
  upcoming: "bg-yellow-100 text-yellow-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
};

function getExamStatus(exam: any) {
  const now = new Date();
  const start = new Date(exam.start_time);
  const end = new Date(exam.end_time);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "completed";
  return "unknown";
}

const ExamListPage: React.FC = () => {
  const menu = useTeacherMenu();
  const { teacher, loading } = useTeacher();
  const displayName = loading ? "Giáo viên" : teacher?.name || "Giáo viên";
  const navigate = useNavigate();

  const { search, setSearch, status, setStatus, loadingExams, filteredExams } =
    useExamList();

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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý kiểm tra</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý các bài kiểm tra</p>
        </div>
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm kiểm tra..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ongoing">Đang diễn ra</option>
              <option value="completed">Đã kết thúc</option>
            </select>
          </div>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            onClick={() => navigate("/teacher/exams/create")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Tạo kiểm tra mới
          </button>
        </div>
        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingExams ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              Đang tải danh sách kiểm tra...
            </div>
          ) : filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {exam.course_name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      statusColor[getExamStatus(exam)] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusMap[getExamStatus(exam)] || "Không rõ"}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 mr-2"
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
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-5 w-5 mr-2"
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
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              Không có kiểm tra nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamListPage;
