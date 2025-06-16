import React, { useEffect, useState } from "react";
import { getMyExamResults } from "../../../services/examService";
import { getRegisteredCourses } from "../../../services/courseService";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useStudentMenu } from "../../../components/student/menuStudent";
import useStudent from "../../../hooks/useStudent";

const ExamResultPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [registeredCourseIds, setRegisteredCourseIds] = useState<number[]>([]);
  const menu = useStudentMenu();
  const { student, loading: studentLoading } = useStudent();
  const displayName = studentLoading ? "Học sinh" : student?.name || "Học sinh";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resultsData, coursesData] = await Promise.all([
          getMyExamResults(),
          getRegisteredCourses(),
        ]);
        setResults(resultsData);
        setRegisteredCourseIds(coursesData.map((c: any) => c.id));
      } catch (err) {
        setError("Không thể tải kết quả thi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResults = results.filter(
    (r) =>
      r.exam_title?.toLowerCase().includes(search.toLowerCase()) ||
      r.course_name?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="mb-8">
        <div className="relative overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-white/40">
                K
              </div>
              <div>
                <div className="text-white text-2xl font-bold mb-1">
                  Kết quả kiểm tra của bạn
                </div>
                <div className="text-white/80 text-base">
                  Quản lý và theo dõi điểm các bài kiểm tra bạn đã tham gia.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tiêu đề danh sách kết quả */}
      <div className="flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-indigo-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-3xl font-extrabold text-indigo-700">
          Danh sách kết quả
        </span>
      </div>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên đề thi hoặc khóa học..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Danh sách kết quả thi */}
      <div className="w-full px-6 space-y-6">
        {filteredResults.map((r) => (
          <div
            key={r.exam_id}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-200 overflow-hidden"
          >
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-lg font-bold text-indigo-700 flex-1">
                    {r.exam_title || "(Đề thi đã bị xóa)"}
                  </div>
                </div>
                <div className="text-gray-600">
                  {r.course_name || "(Khóa học đã bị xóa)"}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Thời lượng:{" "}
                  {r.duration_minutes
                    ? r.duration_minutes + " phút"
                    : "Không xác định"}
                </div>
                <div className="text-gray-700 text-sm mt-1">
                  <span className="font-bold">Bắt đầu:</span>{" "}
                  {r.start_time
                    ? new Date(r.start_time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                      " " +
                      new Date(r.start_time).toLocaleDateString("vi-VN")
                    : "--"}
                </div>
                <div className="text-gray-700 text-sm mt-1">
                  <span className="font-bold">Kết thúc:</span>{" "}
                  {r.end_time
                    ? new Date(r.end_time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                      " " +
                      new Date(r.end_time).toLocaleDateString("vi-VN")
                    : "--"}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-xl font-bold text-green-600">
                  Điểm:{" "}
                  {r.score !== null && r.score !== undefined
                    ? r.score
                    : "Chưa có điểm"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ExamResultPage;
