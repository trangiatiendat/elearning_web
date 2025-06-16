import React, { useState, useEffect } from "react";
import { useStudentMenu } from "../../../components/student/menuStudent";
import DashboardLayout from "../../../layouts/DashboardLayout";
import AssignmentList from "../../../components/student/assignments/AssignmentList";
import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { useLocation, Link } from "react-router-dom";
import {
  getAssignmentsByStudent,
  getStudentAssignments,
} from "../../../services/assignmentService";
import { Assignment as AssignmentType } from "../../../types/assignment";
import useStudent from "../../../hooks/useStudent";
import { MdAssignmentTurnedIn, MdAssignmentLate } from "react-icons/md";
import { getRegisteredCourses } from "../../../services/courseService";

const Assignment: React.FC = () => {
  const location = useLocation();
  const menu = useStudentMenu();
  const {
    student,
    loading: studentLoading,
    error: studentError,
  } = useStudent();
  const [courses, setCourses] = useState<any[]>([]);
  const [openCourseId, setOpenCourseId] = useState<number | null>(null);
  const [courseAssignments, setCourseAssignments] = useState<
    Record<number, AssignmentType[]>
  >({});
  const [loadingAssignments, setLoadingAssignments] = useState<
    Record<number, boolean>
  >({});
  const [assignmentsError, setAssignmentsError] = useState<
    Record<number, string | null>
  >({});

  useEffect(() => {
    // Lấy danh sách khóa học đã đăng ký
    const fetchCourses = async () => {
      try {
        const data = await getRegisteredCourses();
        setCourses(data);
      } catch (err) {
        // ignore
      }
    };
    fetchCourses();
  }, []);

  const handleToggleCourse = async (courseId: number) => {
    if (openCourseId === courseId) {
      setOpenCourseId(null);
      return;
    }
    setOpenCourseId(courseId);
    if (!courseAssignments[courseId]) {
      setLoadingAssignments((prev) => ({ ...prev, [courseId]: true }));
      setAssignmentsError((prev) => ({ ...prev, [courseId]: null }));
      try {
        const data = await getStudentAssignments(courseId);
        setCourseAssignments((prev) => ({ ...prev, [courseId]: data }));
      } catch (err: any) {
        setAssignmentsError((prev) => ({
          ...prev,
          [courseId]: err.message || "Không thể tải danh sách bài tập.",
        }));
      } finally {
        setLoadingAssignments((prev) => ({ ...prev, [courseId]: false }));
      }
    }
  };

  const displayName = student?.name || "Học sinh";

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
      {/* Header chào mừng */}
      <div className="relative overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-white/40">
              H
            </div>
            <div>
              <div className="text-white text-2xl font-bold mb-1">
                Bài tập của bạn
              </div>
              <div className="text-white/80 text-base">
                Quản lý và theo dõi tiến độ làm bài tập của bạn.
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Card lớn chứa danh sách bài tập */}
      <div className="w-full mb-10 px-2 sm:px-6">
        {/* Tiêu đề với icon */}
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
            Danh sách bài tập
          </span>
        </div>
        {/* Danh sách các khóa học */}
        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              Bạn chưa đăng ký khóa học nào.
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-blue-50 rounded-xl shadow-md transition-all duration-200"
              >
                <button
                  className="w-full flex items-center justify-between px-8 py-6 text-xl font-bold text-indigo-800 focus:outline-none"
                  onClick={() => handleToggleCourse(course.id)}
                >
                  <span>{course.name}</span>
                  <span className="text-base">
                    {openCourseId === course.id ? "▲" : "▼"}
                  </span>
                </button>
                {openCourseId === course.id && (
                  <div className="px-8 pb-6">
                    {loadingAssignments[course.id] ? (
                      <div className="text-center text-gray-400 py-8">
                        Đang tải bài tập...
                      </div>
                    ) : assignmentsError[course.id] ? (
                      <div className="text-center text-red-500 py-8">
                        {assignmentsError[course.id]}
                      </div>
                    ) : courseAssignments[course.id]?.length === 0 ? (
                      <div className="text-gray-400 text-center py-8">
                        Không có bài tập nào cho khóa học này.
                      </div>
                    ) : (
                      <AssignmentList
                        filter="all"
                        assignments={courseAssignments[course.id]}
                      />
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assignment;
