import React, { useEffect, useState } from "react";
import useTeacher from "../../../hooks/useTeacher";
import { getCourseAssignmentsAndSubmissionsForTeacher } from "../../../services/assignmentService";
import {
  ChevronDownIcon,
  DocumentTextIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CourseWithAssignmentsAndSubmissions,
  AssignmentWithSubmissions,
  Submission,
} from "../../../types";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";

const SubmissionListPage: React.FC = () => {
  const {
    teacher,
    loading: teacherLoading,
    error: teacherError,
  } = useTeacher();
  const teacherMenu = useTeacherMenu();

  const [data, setData] = useState<CourseWithAssignmentsAndSubmissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCourseId, setOpenCourseId] = useState<number | null>(null);
  const [openAssignmentId, setOpenAssignmentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (teacherLoading) return;
      if (teacherError) {
        setError(`Không thể tải thông tin giáo viên: ${teacherError}`);
        setLoading(false);
        return;
      }
      if (!teacher?.id) {
        setError("Không tìm thấy thông tin giáo viên.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getCourseAssignmentsAndSubmissionsForTeacher(
          parseInt(teacher.id, 10)
        );
        setData(result);
      } catch (err: any) {
        setError("Lỗi khi tải danh sách bài nộp: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacher, teacherLoading, teacherError]);

  const handleToggleCourse = (courseId: number) => {
    setOpenCourseId(openCourseId === courseId ? null : courseId);
    if (openCourseId === courseId) {
      setOpenAssignmentId(null);
    }
  };

  const handleToggleAssignment = (assignmentId: number) => {
    setOpenAssignmentId(
      openAssignmentId === assignmentId ? null : assignmentId
    );
  };

  return (
    <DashboardLayout
      role="teacher"
      name={teacher?.name || "Giáo viên"}
      menu={teacherMenu}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-3">
          <DocumentTextIcon className="h-8 w-8 text-green-500" />
          Danh sách bài nộp
        </h1>
        {loading ? (
          <div className="text-center text-gray-500 py-12 text-lg font-medium">
            Đang tải danh sách bài nộp...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg font-medium">
            Không có dữ liệu bài nộp nào.
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((course) => (
              <div
                key={course.course_id}
                className="bg-green-50 rounded-xl shadow-md border border-green-200"
              >
                <button
                  className="flex items-center justify-between w-full px-6 py-5 text-lg font-semibold text-left text-green-800 bg-green-50 hover:bg-green-200 focus:outline-none transition-colors"
                  onClick={() => handleToggleCourse(course.course_id)}
                >
                  <span className="font-bold">{course.course_name}</span>
                  <ChevronDownIcon
                    className={`h-6 w-6 text-green-100 transition-transform duration-200 ${
                      openCourseId === course.course_id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openCourseId === course.course_id && (
                  <div className="p-6 border-t border-green-100 bg-white space-y-4">
                    {course.assignments.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        Không có bài tập nào trong khóa học này.
                      </div>
                    ) : (
                      course.assignments.map(
                        (assignment: AssignmentWithSubmissions) => (
                          <div
                            key={assignment.assignment_id}
                            className="bg-white rounded-md shadow-sm overflow-hidden border border-green-200"
                          >
                            <button
                              className="flex items-center justify-between w-full px-4 py-3 text-base font-semibold text-left text-green-800 bg-green-50 hover:bg-green-100 focus:outline-none transition-colors"
                              onClick={() =>
                                handleToggleAssignment(assignment.assignment_id)
                              }
                            >
                              {assignment.assignment_title}
                              <ChevronDownIcon
                                className={`h-6 w-6 text-green-600 transition-transform duration-200 ${
                                  openAssignmentId === assignment.assignment_id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                            {openAssignmentId === assignment.assignment_id && (
                              <div className="p-4 border-t border-green-100 bg-white space-y-4">
                                {assignment.submissions.length === 0 ? (
                                  <div className="text-center text-gray-500 py-4">
                                    Chưa có sinh viên nào nộp bài tập này.
                                  </div>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-green-200 rounded-lg overflow-hidden">
                                      <thead className="bg-green-100">
                                        <tr>
                                          <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                                            Học sinh
                                          </th>
                                          <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                                            File đã nộp
                                          </th>
                                          <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                                            Thời gian nộp
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-green-100">
                                        {assignment.submissions.map(
                                          (submission: Submission) => (
                                            <tr
                                              key={submission.submission_id}
                                              className="hover:bg-green-50 transition"
                                            >
                                              <td className="px-4 py-3 flex items-center gap-2 font-medium text-gray-800">
                                                <UserCircleIcon className="h-6 w-6 text-green-400" />
                                                {submission.student_name}
                                              </td>
                                              <td className="px-4 py-3 text-green-700">
                                                {submission.submission_file_url ? (
                                                  <a
                                                    href={
                                                      submission.submission_file_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:underline"
                                                  >
                                                    <PaperClipIcon className="h-4 w-4" />
                                                    Tải file
                                                  </a>
                                                ) : (
                                                  "-"
                                                )}
                                              </td>
                                              <td className="px-4 py-3 text-gray-700">
                                                <span className="flex items-center gap-1">
                                                  <ClockIcon className="h-4 w-4 text-gray-400" />
                                                  {new Date(
                                                    submission.submitted_at
                                                  ).toLocaleString("vi-VN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour12: false,
                                                  })}
                                                </span>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubmissionListPage;
