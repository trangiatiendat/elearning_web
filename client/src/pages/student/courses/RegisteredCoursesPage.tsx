import React, { useEffect, useState } from "react";
import { useStudentMenu } from "../../../components/student/menuStudent";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FireIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { getRegisteredCourses } from "../../../services/courseService";
import { useNavigate } from "react-router-dom";
import useStudent from "../../../hooks/useStudent";

const statusColor: { [key: string]: string } = {
  "Đang học": "bg-green-100 text-green-700",
  "Đã hoàn thành": "bg-blue-100 text-blue-700",
};

const RegisteredCoursesPage: React.FC = () => {
  const menu = useStudentMenu();
  const navigate = useNavigate();
  const { student, loading } = useStudent();
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError("");
    try {
      const res = await getRegisteredCourses();
      setCourses(res);
    } catch (err) {
      setError("Không thể tải danh sách khóa học đã đăng ký");
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Lọc khóa học theo từ khóa tìm kiếm
  const filteredCourses = courses.filter((course) =>
    (course.name || "").toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Header màu gradient */}
      <div className="relative overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ">
          <div>
            <div className="text-white text-3xl font-bold mb-2">
              Khóa học đã đăng ký
            </div>
            <div className="text-white/90 text-base">
              Danh sách các khóa học bạn đã đăng ký và đang tham gia.
            </div>
          </div>
        </div>
      </div>
      {/* Phần tìm kiếm và danh sách */}
      <div className="p-8 pt-0">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loadingCourses ? (
          <div className="text-center text-gray-400 py-12 text-lg">
            Đang tải...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 text-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {filteredCourses.map((course, idx) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-200 flex flex-col overflow-hidden"
              >
                <img
                  src={course.image_url || course.image}
                  alt={course.title || course.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-indigo-700 group-hover:text-pink-600 transition-colors">
                      {course.title || course.name}
                    </span>
                  </div>
                  {course.teacher_name && (
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Giáo viên: {course.teacher_name}
                    </div>
                  )}
                  {course.hot && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 flex items-center gap-1">
                      <FireIcon className="h-4 w-4" /> Hot
                    </span>
                  )}
                  {course.active && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-600 flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4" /> Đang học
                    </span>
                  )}
                  <div className="text-gray-500 text-sm mb-3 min-h-[40px]">
                    {course.description}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                        statusColor[course.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {course.status || "Đang học"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Ngày đăng ký:{" "}
                      {course.registered_at
                        ? new Date(course.registered_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <button
                    className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-pink-500 transition-colors"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12 text-lg">
                Không có khoá học nào đã đăng ký.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegisteredCoursesPage;
