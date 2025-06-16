import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import {
  getAssignments,
  deleteAssignment,
} from "../../../services/assignmentService";
import { Assignment } from "../../../types/assignment";
import AssignmentRow from "../../../components/teacher/assignments/AssignmentRow";
import ConfirmDeleteModal from "../../../components/teacher/assignments/ConfirmDeleteModal";
import { getTeacherCourses } from "../../../services/courseService";
import { Course } from "../../../types";

const AssignmentsManagement: React.FC = () => {
  const menu = useTeacherMenu();
  const { teacher, loading } = useTeacher();
  const displayName = loading ? "Giáo viên" : teacher?.name || "Giáo viên";
  const navigate = useNavigate();

  // State quản lý assignments
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Fetch assignments
  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const data = await getAssignments();
      data.forEach((a) =>
        console.log("Assignment courseId:", a.courseId, typeof a.courseId)
      );
      setAssignments(data);
    } catch (e) {
      setError("Không thể tải danh sách bài tập.");
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const teacherCourses = await getTeacherCourses();
      setCourses(teacherCourses);
    } catch (e) {
      console.error("Failed to fetch teacher courses:", e);
      // Optionally set an error state for courses
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (teacher) {
      fetchCourses();
    }
  }, [teacher]);

  // Xử lý xóa assignment
  const handleDelete = async (id: number) => {
    try {
      await deleteAssignment(id);
      fetchAssignments();
      setConfirmDeleteId(null);
    } catch (e) {
      setError("Không thể xóa bài tập.");
    }
  };

  // Debug log trước return
  console.log("selectedCourseId:", selectedCourseId, typeof selectedCourseId);
  console.log(
    "assignments:",
    assignments.map((a) => [a.courseId, typeof a.courseId])
  );
  console.log(
    "courses:",
    courses.map((c) => [c.id, typeof c.id])
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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài tập</h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý bài tập cho học sinh
          </p>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                console.log(
                  "Selected courseId changed:",
                  e.target.value,
                  typeof e.target.value
                );
              }}
            >
              <option value="">Tất cả khóa học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => navigate("/teacher/assignments/create")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
            Tạo bài tập mới
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full overflow-x-auto">
          <div className="divide-y divide-gray-200">
            <div className="bg-gray-50 py-3">
              <div className="flex w-full items-stretch font-medium text-gray-700">
                <div className="flex-1 min-w-0 text-left px-3">Tên bài tập</div>
                <div className="flex-grow-0 flex-shrink-0 basis-32 min-w-0 text-center px-3">
                  Khóa học
                </div>
                <div className="flex-grow-0 flex-shrink-0 basis-32 min-w-0 text-center px-3">
                  Chủ đề
                </div>
                <div className="flex-grow-0 flex-shrink-0 basis-24 min-w-0 text-center px-3">
                  Hạn nộp
                </div>
                <div className="flex-grow-0 flex-shrink-0 basis-28 min-w-0 text-center px-3">
                  Ngày tạo
                </div>
                <div className="flex-grow-0 flex-shrink-0 basis-32 min-w-0 text-center px-3">
                  File đính kèm
                </div>
                <div className="flex-grow-0 flex-shrink-0 basis-28 min-w-0 text-center px-3">
                  Thao tác
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 bg-white">
              {loadingAssignments ? (
                <div className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </div>
              ) : assignments.length === 0 ? (
                <div className="px-6 py-4 text-center text-gray-500">
                  Chưa có bài tập nào.
                </div>
              ) : (
                assignments
                  .filter((assignment) => {
                    const matchTitle = assignment.title
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase());
                    const matchCourse =
                      selectedCourseId === "" ||
                      assignment.courseId === Number(selectedCourseId);
                    console.log("Filter check:", {
                      title: assignment.title,
                      matchTitle,
                      courseId: assignment.courseId,
                      matchCourse,
                      selectedCourseId,
                    });
                    return matchTitle && matchCourse;
                  })
                  .map((a: Assignment) => (
                    <AssignmentRow
                      key={a.id}
                      assignment={a}
                      onEdit={() =>
                        navigate(`/teacher/assignments/${a.id}/edit`)
                      }
                      onDelete={() => setConfirmDeleteId(a.id)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
        <ConfirmDeleteModal
          visible={confirmDeleteId !== null}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        />
      </div>
    </DashboardLayout>
  );
};

export default AssignmentsManagement;
