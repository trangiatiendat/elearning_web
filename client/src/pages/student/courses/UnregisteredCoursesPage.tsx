import React, { useState, useEffect } from "react";
import { useStudentMenu } from "../../../components/student/menuStudent";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FireIcon } from "@heroicons/react/24/solid";
import {
  getUnregisteredCourses,
  registerCourse,
} from "../../../services/courseService";
import useStudent from "../../../hooks/useStudent";

const UnregisteredCoursesPage: React.FC = () => {
  // State cho danh sách khóa học và tìm kiếm
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");

  // State cho modal đăng ký
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [inputPassword, setInputPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const menu = useStudentMenu();
  const { student, loading: studentLoading } = useStudent();

  // Lấy danh sách khóa học chưa đăng ký
  const fetchCourses = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await getUnregisteredCourses();
      setCourses(res);
    } catch (err) {
      setFetchError("Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Lọc khóa học theo từ khóa tìm kiếm
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  // Mở modal đăng ký
  const handleRegisterClick = (course: any) => {
    setSelectedCourse(course);
    setShowModal(true);
    setInputPassword("");
    setModalError("");
    setModalSuccess("");
  };

  // Xử lý đăng ký khóa học
  const handleSubmit = async () => {
    if (!selectedCourse) return;
    setModalError("");
    setModalSuccess("");
    if (!inputPassword) {
      setModalError("Vui lòng nhập mật khẩu khóa học!");
      return;
    }
    try {
      await registerCourse(selectedCourse.id, inputPassword);
      setModalSuccess("Đăng ký thành công!");
      setTimeout(() => {
        setShowModal(false);
        setModalSuccess("");
        fetchCourses();
      }, 1000);
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error === "Mật khẩu không đúng"
      ) {
        setModalError("Sai mật khẩu khóa học!");
      } else {
        setModalError("Đăng ký thất bại, vui lòng thử lại!");
      }
    }
  };

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
      {/* Header */}
      <div className="relative overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ">
          <div>
            <div className="text-white text-3xl font-bold mb-2">
              Khóa học chưa đăng ký
            </div>
            <div className="text-white/90 text-base">
              Danh sách các khóa học bạn có thể đăng ký tham gia.
            </div>
          </div>
        </div>
      </div>
      {/* Tìm kiếm và danh sách khóa học */}
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
        {loading ? (
          <div className="text-center text-gray-400 py-12 text-lg">
            Đang tải...
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-500 py-12 text-lg">
            {fetchError}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {filteredCourses.map((course) => (
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
                  <div className="text-gray-500 text-sm mb-3 min-h-[40px]">
                    {course.description}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400">
                      Ngày mở:{" "}
                      {course.created_at
                        ? new Date(course.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <button
                    className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-pink-500 transition-colors"
                    onClick={() => handleRegisterClick(course)}
                  >
                    Đăng ký
                  </button>
                </div>
              </div>
            ))}
            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12 text-lg">
                Không có khoá học nào chưa đăng ký.
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal nhập mật khẩu */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">
              Nhập mật khẩu để đăng ký
            </h2>
            <div className="mb-4">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Nhập mật khẩu khóa học"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setModalError("");
                }}
              />
            </div>
            {modalError && (
              <div className="text-red-500 mb-2 text-sm">{modalError}</div>
            )}
            {modalSuccess && (
              <div className="text-green-600 mb-2 text-sm">{modalSuccess}</div>
            )}
            <button
              className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-pink-500 transition-colors"
              onClick={handleSubmit}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UnregisteredCoursesPage;
