import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import TopicList from "../../../components/teacher/courses/TopicList";
import { useTeacherCourseDetail } from "../../../hooks/courses/useTeacherCourseDetail";

const CourseDetail = () => {
  const menu = useTeacherMenu();
  const { teacher, loading: teacherLoading } = useTeacher();
  const displayName = teacherLoading
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";

  const {
    course,
    loading,
    navigate,
    editingTopicId,
    setEditingTopicId,
    topicDraft,
    setTopicDraft,
    addingTopic,
    setAddingTopic,
    handleAddTopic,
    handleEditTopic,
    handleDeleteTopic,
    addingMaterialTopicId,
    setAddingMaterialTopicId,
    materialDraft,
    setMaterialDraft,
    handleAddMaterial,
    editingMaterialId,
    setEditingMaterialId,
    handleEditMaterial,
    handleDeleteMaterial,
  } = useTeacherCourseDetail();

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
        {loading ? (
          <div>Đang tải...</div>
        ) : !course ? (
          <div>Không tìm thấy khóa học!</div>
        ) : (
          <>
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col items-center mb-8">
              {course.image_url && (
                <img
                  src={course.image_url || "/default-course.png"}
                  alt={course.name}
                  className="w-full max-w-md h-56 object-cover rounded-lg shadow mb-4 border border-gray-200"
                  onError={(e) => (e.currentTarget.src = "/default-course.png")}
                />
              )}
              <h1 className="text-3xl font-bold mb-2 text-center text-green-700">
                {course.name}
              </h1>
              <p className="mb-2 text-gray-700 text-center text-lg">
                {course.description}
              </p>
              <p className="text-gray-500 text-sm text-center">
                Ngày tạo: {new Date(course.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-6 pt-6 border-t mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Nội dung khóa học
                </h2>
                <button
                  type="button"
                  onClick={() => setAddingTopic(true)}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
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
                  Thêm chủ đề
                </button>
              </div>
              {addingTopic && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 mb-4">
                  <div className="flex gap-4">
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tiêu đề chủ đề"
                      value={topicDraft.title || ""}
                      onChange={(e) =>
                        setTopicDraft({ ...topicDraft, title: e.target.value })
                      }
                    />
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Mô tả"
                      value={topicDraft.description || ""}
                      onChange={(e) =>
                        setTopicDraft({
                          ...topicDraft,
                          description: e.target.value,
                        })
                      }
                    />
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={handleAddTopic}
                    >
                      Lưu
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      onClick={() => {
                        setAddingTopic(false);
                        setTopicDraft({});
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
              <TopicList
                topics={course.topics}
                editingTopicId={editingTopicId}
                setEditingTopicId={setEditingTopicId}
                topicDraft={topicDraft}
                setTopicDraft={setTopicDraft}
                handleEditTopic={handleEditTopic}
                handleDeleteTopic={handleDeleteTopic}
                addingMaterialTopicId={addingMaterialTopicId}
                setAddingMaterialTopicId={setAddingMaterialTopicId}
                materialDraft={materialDraft}
                setMaterialDraft={setMaterialDraft}
                handleAddMaterial={handleAddMaterial}
                editingMaterialId={editingMaterialId}
                setEditingMaterialId={setEditingMaterialId}
                handleEditMaterial={handleEditMaterial}
                handleDeleteMaterial={handleDeleteMaterial}
              />
            </div>
            <button
              className="mt-8 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => navigate("/teacher/courses/manage")}
            >
              Quay lại
            </button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
