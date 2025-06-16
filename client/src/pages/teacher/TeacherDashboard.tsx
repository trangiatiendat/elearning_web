import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../components/teacher/menuTeacher";
import useTeacher from "../../hooks/useTeacher";
import {
  getDashboardStats,
  getRecentActivities,
} from "../../services/dashboardService";

const TeacherDashboard = () => {
  const menu = useTeacherMenu();
  const { teacher, loading } = useTeacher();

  const displayName = loading ? "Giáo viên" : teacher?.name || "Giáo viên";

  // Thêm state cho stats
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Thêm state cho hoạt động gần đây
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStats(data);
      setLoadingStats(false);
    });
  }, []);

  useEffect(() => {
    if (teacher && teacher.id) {
      getRecentActivities(Number(teacher.id)).then((data) => {
        setActivities(data);
        setLoadingActivities(false);
      });
    }
  }, [teacher]);

  const actionToText = (action: string) => {
    switch (action) {
      case "create_course":
        return "Tạo khóa học mới";
      case "update_course":
        return "Cập nhật khóa học";
      case "delete_course":
        return "Xóa khóa học";
      case "create_exam":
        return "Tạo bài kiểm tra mới";
      case "update_exam":
        return "Cập nhật bài kiểm tra";
      case "delete_exam":
        return "Xóa bài kiểm tra";
      case "create_assignment":
        return "Tạo bài tập mới";
      case "update_assignment":
        return "Cập nhật bài tập";
      case "delete_assignment":
        return "Xóa bài tập";
      default:
        return action;
    }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleString("vi-VN");

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
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Xem tổng quan và quản lý các hoạt động giảng dạy của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <span className="text-gray-500">Tổng số học sinh</span>
            <span className="text-2xl font-bold mt-2">
              {loadingStats ? "..." : stats?.studentCount ?? 0}
            </span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <span className="text-gray-500">Khóa học đang dạy</span>
            <span className="text-2xl font-bold mt-2">
              {loadingStats ? "..." : stats?.courseCount ?? 0}
            </span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <span className="text-gray-500">Bài tập</span>
            <span className="text-2xl font-bold mt-2">
              {loadingStats ? "..." : stats?.assignmentCount ?? 0}
            </span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <span className="text-gray-500">Bài kiểm tra</span>
            <span className="text-2xl font-bold mt-2">
              {loadingStats ? "..." : stats?.examCount ?? 0}
            </span>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
            <div className="space-y-4">
              {loadingActivities ? (
                <div>Đang tải...</div>
              ) : activities.length === 0 ? (
                <div>Không có hoạt động nào gần đây.</div>
              ) : (
                activities.map((act, idx) => (
                  <div className="flex items-center gap-4" key={idx}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {actionToText(act.action)}
                      </p>
                      {act.details && (
                        <p className="text-sm text-gray-600">{act.details}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {formatTime(act.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
