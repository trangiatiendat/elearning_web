import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import { useExamCreate } from "../../../hooks/exams/useExamCreate";

const ExamCreatePage: React.FC = () => {
  const menu = useTeacherMenu();
  const { teacher, loading } = useTeacher();
  const displayName = loading ? "Giáo viên" : teacher?.name || "Giáo viên";

  const { form, loadingForm, error, courses, handleChange, handleSubmit } =
    useExamCreate();

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
      <div className="p-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h1 className="text-2xl font-bold mb-8 text-green-700 text-center">
            Tạo kiểm tra mới
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Khóa học
              </label>
              <select
                name="course_id"
                value={form.course_id}
                onChange={handleChange}
                className="w-full border border-green-200 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                required
              >
                <option value="">-- Chọn khóa học --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Tên kiểm tra
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-green-200 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Mô tả
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-green-200 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                name="duration_minutes"
                value={form.duration_minutes}
                onChange={handleChange}
                className="w-full border border-green-200 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                min={1}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  className="w-full border border-green-200 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  className="w-full border border-green-200 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
            {error && <div className="text-red-600 text-center">{error}</div>}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-2 rounded-xl hover:bg-green-700 text-base font-bold shadow-md transition-colors"
                disabled={loadingForm}
              >
                {loadingForm ? "Đang lưu..." : "Lưu kiểm tra"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamCreatePage;
