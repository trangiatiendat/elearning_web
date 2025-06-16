import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  getStudentsByCourseId,
} from "../../../services/courseService";

interface Course {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
  password: string;
  // Thêm các trường khác nếu cần
}

const ManageCourses = () => {
  const menu = useTeacherMenu();
  const { teacher, loading: teacherLoading } = useTeacher();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [studentCounts, setStudentCounts] = useState<Record<number, number>>(
    {}
  );

  const displayName = teacherLoading
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      alert("Đã xóa khóa học thành công!");
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/courses/teacher/courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses(res.data);
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Không thể tải danh sách khóa học"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length === 0) return;
    const fetchStudentCounts = async () => {
      const counts: Record<number, number> = {};
      for (const course of courses) {
        try {
          const students = await getStudentsByCourseId(course.id);
          counts[course.id] = students.length;
        } catch {
          counts[course.id] = 0;
        }
      }
      setStudentCounts(counts);
    };
    fetchStudentCounts();
  }, [courses]);

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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khóa học</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các khóa học của bạn
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="draft">Bản nháp</option>
              <option value="ended">Đã kết thúc</option>
            </select>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-gray-100 border-b-2 border-gray-200 rounded-t-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[60px]">
                <div className="col-span-1 font-bold text-gray-700 px-6 py-3 uppercase tracking-wider">
                  Ảnh
                </div>
                <div className="col-span-3 font-bold text-gray-700 py-3 uppercase tracking-wider">
                  Tên khóa học
                </div>
                <div className="col-span-2 font-bold text-gray-700 py-3 uppercase tracking-wider">
                  Học sinh
                </div>
                <div className="col-span-2 font-bold text-gray-700 py-3 uppercase tracking-wider">
                  Trạng thái
                </div>
                <div className="col-span-2 font-bold text-gray-700 py-3 uppercase tracking-wider">
                  Ngày tạo
                </div>
                <div className="col-span-2 font-bold text-gray-700 py-3 uppercase tracking-wider">
                  Thao tác
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Đang tải...
                </div>
              ) : error ? (
                <div className="px-6 py-8 text-center text-red-500">
                  {error}
                </div>
              ) : courses.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Chưa có khóa học nào
                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="grid grid-cols-12 gap-4 items-center min-h-[70px] hover:bg-green-50 transition-all duration-200 rounded-xl mb-2 shadow-sm"
                  >
                    <div className="col-span-1 flex items-center px-6 py-4">
                      <img
                        src={course.image_url || "/default-course.png"}
                        alt={course.name}
                        className="h-12 w-12 object-cover rounded-lg border-2 border-green-400 shadow"
                        onError={(e) =>
                          (e.currentTarget.src = "/default-course.png")
                        }
                      />
                    </div>
                    <div className="col-span-3 py-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        {course.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {course.description}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        <span className="font-semibold">Mật khẩu:</span>{" "}
                        <span style={{ letterSpacing: 2 }}>
                          {course.password ? course.password : "--"}
                        </span>
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center py-4">
                      <span className="text-sm text-gray-900">
                        {studentCounts[course.id] !== undefined
                          ? studentCounts[course.id]
                          : "--"}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full shadow">
                        Đang hoạt động
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center py-4">
                      <span className="text-sm text-gray-900">
                        {new Date(course.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                          title="Sửa"
                          onClick={() =>
                            navigate(`/teacher/courses/edit/${course.id}`)
                          }
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          title="Xem"
                          onClick={() =>
                            navigate(`/teacher/courses/${course.id}`)
                          }
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Xóa"
                          onClick={() => handleDelete(course.id)}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
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

export default ManageCourses;
