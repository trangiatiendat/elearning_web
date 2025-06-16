import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useStudentExamList } from "../../../hooks/exams/useStudentExamList";
import { useNavigate } from "react-router-dom";
import useStudent from "../../../hooks/useStudent";
import { useStudentMenu } from "../../../components/student/menuStudent";
import StudentExamCard from "../../../components/student/exams/StudentExamCard";
import FaceVerificationModal from "../../../components/student/exams/FaceVerificationModal";

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
  const menu = useStudentMenu();
  const { student, loading } = useStudent();
  const displayName = loading ? "Học sinh" : student?.name || "Học sinh";
  const navigate = useNavigate();

  const { search, setSearch, status, setStatus, loadingExams, filteredExams } =
    useStudentExamList();

  const [showFaceModal, setShowFaceModal] = React.useState(false);
  const [selectedExamId, setSelectedExamId] = React.useState<
    number | string | null
  >(null);

  return (
    <DashboardLayout
      role="student"
      name={displayName}
      menu={menu}
      avatar={student?.avatar}
      userInfo={{
        name: displayName,
        role: "Học sinh",
        email: student?.email,
        avatar: student?.avatar,
      }}
    >
      <div>
        {/* Header gradient full width */}
        <div className="mb-8 -mx-8 mt-0">
          <div className="flex flex-col justify-center pl-16 pr-24 py-8 rounded-2xl shadow bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            <div className="text-white text-2xl md:text-3xl font-extrabold mb-2 tracking-wide">
              Kiểm tra của bạn
            </div>
            <div className="text-white/90 text-base">
              Quản lý và theo dõi các bài kiểm tra bạn có thể tham gia.
            </div>
          </div>
        </div>
        <div className="p-8">
          {/* Actions */}
          <div className="flex gap-4 mb-6">
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
          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingExams ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                Đang tải danh sách kiểm tra...
              </div>
            ) : filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <StudentExamCard
                  key={exam.id}
                  exam={exam}
                  onStart={() => {
                    setSelectedExamId(exam.id);
                    setShowFaceModal(true);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                Không có kiểm tra nào phù hợp.
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Face Verification Modal */}
      {showFaceModal && selectedExamId && (
        <FaceVerificationModal
          examId={selectedExamId}
          onSuccess={() => {
            setShowFaceModal(false);
            navigate(`/student/exams/${selectedExamId}/start`);
          }}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default ExamListPage;
