import React, { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import { useExamList } from "../../../hooks/exams/useExamList";
import { useExamSubmissions } from "../../../hooks/exams/useExamSubmissions";
import {
  AcademicCapIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const ExamResultsManagement: React.FC = () => {
  const menu = useTeacherMenu();
  const { teacher, loading: loadingTeacher } = useTeacher();
  const displayName = loadingTeacher
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";
  const { filteredExams, loadingExams } = useExamList();
  const [openExamId, setOpenExamId] = useState<number | null>(null);

  const { submissions, loading, error } = useExamSubmissions(
    openExamId ?? undefined
  );

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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-3">
          <AcademicCapIcon className="h-8 w-8 text-green-500" />
          Kết quả thi của sinh viên
        </h1>
        {loadingExams ? (
          <div className="text-center text-gray-500 py-12 text-lg font-medium">
            Đang tải danh sách kỳ thi...
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg font-medium">
            Không có kỳ thi nào.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredExams.map((exam) => {
              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200"
                >
                  <button
                    className="flex items-center justify-between w-full px-6 py-5 text-lg font-semibold text-left text-green-800 bg-green-50 hover:bg-green-100 focus:outline-none transition-colors"
                    onClick={() =>
                      setOpenExamId(openExamId === exam.id ? null : exam.id)
                    }
                  >
                    <div>
                      <span className="font-bold">{exam.title}</span>
                      <span className="ml-2 text-gray-500 text-base font-normal">
                        ({exam.course_name})
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`h-6 w-6 text-green-600 transition-transform duration-200 ${
                        openExamId === exam.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openExamId === exam.id && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                      {loading ? (
                        <div className="text-center text-gray-500 py-8 text-base">
                          Đang tải kết quả...
                        </div>
                      ) : error ? (
                        <div className="text-center text-red-500 py-8">
                          {error}
                        </div>
                      ) : submissions.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          Chưa có sinh viên nào nộp bài kiểm tra này.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-green-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                                  Học sinh
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-green-700 uppercase tracking-wider">
                                  Điểm
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                                  Thời gian nộp
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {submissions.map((s) => (
                                <tr
                                  key={s.student_id}
                                  className="hover:bg-green-50 transition"
                                >
                                  <td className="px-4 py-3 flex items-center gap-2 font-medium text-gray-800">
                                    <UserCircleIcon className="h-6 w-6 text-green-400" />
                                    {s.student_name}
                                  </td>
                                  <td className="px-4 py-3 text-gray-700">
                                    {s.student_email || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-center text-lg font-bold text-green-700">
                                    {s.score ?? "-"}
                                  </td>
                                  <td className="px-4 py-3 text-gray-700">
                                    {new Date(s.submitted_at).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamResultsManagement;
