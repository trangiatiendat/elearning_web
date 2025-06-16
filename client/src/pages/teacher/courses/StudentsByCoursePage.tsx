import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import {
  getTeacherCourses,
  getStudentsByCourseId,
} from "../../../services/courseService";
import {
  ChevronDownIcon,
  UserCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

const StudentsByCoursePage = () => {
  const menu = useTeacherMenu();
  const { teacher, loading: teacherLoading } = useTeacher();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCourseId, setOpenCourseId] = useState<number | null>(null);
  const [studentsByCourse, setStudentsByCourse] = useState<
    Record<number, any[]>
  >({});

  const displayName = teacherLoading
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getTeacherCourses();
        setCourses(res);
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

  const handleToggleCourse = async (courseId: number) => {
    if (openCourseId === courseId) {
      setOpenCourseId(null);
      return;
    }
    setOpenCourseId(courseId);
    if (!studentsByCourse[courseId]) {
      try {
        const students = await getStudentsByCourseId(courseId);
        setStudentsByCourse((prev) => ({ ...prev, [courseId]: students }));
      } catch {
        setStudentsByCourse((prev) => ({ ...prev, [courseId]: [] }));
      }
    }
  };

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
          <BookOpenIcon className="h-8 w-8 text-green-500" />
          Danh sách học sinh theo khóa học
        </h1>
        {loading ? (
          <div className="text-center text-gray-500 py-12 text-lg font-medium">
            Đang tải danh sách khóa học...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg font-medium">
            Chưa có khóa học nào.
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md border border-gray-200"
              >
                <button
                  className="flex items-center justify-between w-full px-6 py-5 text-lg font-semibold text-left text-green-800 bg-green-50 hover:bg-green-100 focus:outline-none transition-colors"
                  onClick={() => handleToggleCourse(course.id)}
                >
                  <div>
                    <span className="font-bold">{course.name}</span>
                    <span className="ml-2 text-gray-500 text-base font-normal">
                      ({course.description})
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`h-6 w-6 text-green-600 transition-transform duration-200 ${
                      openCourseId === course.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openCourseId === course.id && (
                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5 text-green-500" />
                      Học sinh đã đăng ký (
                      {studentsByCourse[course.id]?.length || 0}):
                    </div>
                    {studentsByCourse[course.id]?.length ? (
                      <ul className="list-disc ml-8 text-gray-800 text-sm">
                        {studentsByCourse[course.id].map((student) => (
                          <li key={student.id}>
                            {student.name} ({student.email})
                            {student.registered_at && (
                              <span className="ml-2 text-gray-500">
                                - Đăng ký:{" "}
                                {new Date(
                                  student.registered_at
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-sm ml-8">
                        Chưa có học sinh đăng ký.
                      </div>
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

export default StudentsByCoursePage;
