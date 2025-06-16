import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useStudentMenu } from "../../../components/student/menuStudent";
import { useStudentCourseDetail } from "../../../hooks/courses/useStudentCourseDetail";
import useStudent from "../../../hooks/useStudent";

const CourseDetailPage = () => {
  const { course, loading, error, currentVideoUrl, setCurrentVideoUrl } =
    useStudentCourseDetail();
  const menu = useStudentMenu();
  const { student, loading: studentLoading } = useStudent();

  const getEmbedUrl = (watchUrl: string): string | null => {
    try {
      const url = new URL(watchUrl);
      if (
        url.hostname === "www.youtube.com" ||
        url.hostname === "youtube.com"
      ) {
        const videoId = url.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      return null;
    } catch (e) {
      console.error("Invalid URL:", watchUrl, e);
      return null;
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;
  if (!course) return <div>Không tìm thấy khóa học.</div>;

  const embedUrl = currentVideoUrl ? getEmbedUrl(currentVideoUrl) : null;

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
      {/* Header gradient */}
      <div className="relative overflow-hidden mb-4 shadow-lg">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[110px]">
          <div>
            <div className="text-white text-3xl font-bold mb-2">
              {course.name}
            </div>
            <div className="text-white/90 text-base">{course.description}</div>
          </div>
        </div>
      </div>
      {/* Nội dung chính */}
      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8">
        {/* Video player */}
        <div className="flex-1 bg-black rounded-xl shadow-lg flex items-center justify-center min-h-[430px]">
          {embedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <span className="text-white text-lg font-semibold">
              Chọn bài học để xem video
            </span>
          )}
        </div>
        {/* Danh sách chương và bài học */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[500px]">
          <div className="text-xl font-bold text-indigo-700 mb-4">
            Nội dung khóa học
          </div>
          <div className="divide-y divide-gray-200">
            {course.topics.map((topic, idx) => (
              <div key={topic.id || idx} className="py-3">
                <div className="font-semibold text-gray-800 mb-2">
                  {topic.title}
                </div>
                <ul className="space-y-1">
                  {topic.materials.map((material, lidx) => (
                    <li
                      key={material.id || lidx}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        material.url === currentVideoUrl
                          ? "bg-indigo-100 text-indigo-800 font-semibold"
                          : "hover:bg-indigo-50 text-gray-700"
                      }`}
                      onClick={() =>
                        material.url && setCurrentVideoUrl(material.url)
                      }
                    >
                      <span className="flex-1">{material.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Các phần khác như ghi chú, thảo luận, v.v. */}
      <div className="mt-10  px-4 md:px-8">
        <em className="text-gray-400">
          Phần ghi chú, thảo luận, tài liệu... (placeholder)
        </em>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;
