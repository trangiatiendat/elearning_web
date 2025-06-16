import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useStudentMenu } from "../../components/student/menuStudent";
import { MdOutlineAssignment, MdOutlineSchool } from "react-icons/md";
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { useEffect, useState } from "react";
import { getAssignmentsByStudent } from "../../services/assignmentService";
import { Assignment } from "../../types/assignment";
import useStudent from "../../hooks/useStudent";
import { getRegisteredCourses } from "../../services/courseService";
import { getRecentActivitiesStudent } from "../../services/dashboardService";
import { getStudentExams } from "../../services/examService";

const StudentDashboard: React.FC = () => {
  const menu = useStudentMenu();
  const {
    student,
    loading: studentLoading,
    error: studentError,
  } = useStudent();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (studentLoading) return;

      if (studentError) {
        setAssignmentsError(
          `Không thể tải thông tin học sinh: ${studentError}`
        );
        setLoadingAssignments(false);
        return;
      }

      if (!student?.id) {
        setAssignmentsError("Student information not available.");
        setLoadingAssignments(false);
        return;
      }

      try {
        setLoadingAssignments(true);
        setAssignmentsError(null);
        const studentId = Number(student.id);
        const data = await getAssignmentsByStudent(studentId);
        setAssignments(data);
      } catch (err: any) {
        setAssignmentsError(err.message || "Không thể tải danh sách bài tập.");
        console.error("Error fetching assignments:", err);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [student, studentLoading, studentError]);

  const formatTime = (iso: string) => new Date(iso).toLocaleString("vi-VN");

  useEffect(() => {
    if (!student || studentLoading) return;
    // Lấy khóa học đã đăng ký
    getRegisteredCourses().then(setCourses);
    // Lấy bài kiểm tra
    getStudentExams().then(setExams);
    // Lấy hoạt động gần đây
    getRecentActivitiesStudent(Number(student.id)).then((data) => {
      setActivities(data);
      setLoadingActivities(false);
    });
  }, [student, studentLoading]);

  const submittedAssignments = assignments.filter(
    (a) => a.status === "submitted"
  ).length;
  const pendingAssignments = assignments.filter(
    (a) => a.status === "pending"
  ).length;
  const totalAssignments = assignments.length;

  return (
    <DashboardLayout
      role="student"
      name={student?.name || "Học sinh"}
      menu={menu}
      avatar={student?.avatar}
      userInfo={{
        name: student?.name || "Học sinh",
        role: "Học sinh",
        email: student?.email,
        avatar: student?.avatar,
      }}
    >
      {/* Content */}
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Chào mừng trở lại, {student?.name || "Học sinh"}!
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-gray-500 mb-2">Khóa học đã đăng ký</div>
            <div className="text-3xl font-bold">{courses.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-gray-500 mb-2">Bài tập</div>
            <div className="text-3xl font-bold">{assignments.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-gray-500 mb-2">Bài kiểm tra</div>
            <div className="text-3xl font-bold">{exams.length}</div>
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
          <ul>
            {loadingActivities ? (
              <li>Đang tải...</li>
            ) : activities.length === 0 ? (
              <li>Không có hoạt động nào gần đây.</li>
            ) : (
              activities.map((activity: any, idx: number) => (
                <li key={idx} className="mb-3 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{activity.action}</div>
                    <div className="text-gray-500 text-sm">
                      {activity.details}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatTime(activity.created_at)}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
