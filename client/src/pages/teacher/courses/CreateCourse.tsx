import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../../components/teacher/menuTeacher";
import useTeacher from "../../../hooks/useTeacher";
import TopicForm from "../../../components/teacher/courses/TopicForm";
import {
  useCreateCourseForm,
  FormData,
} from "../../../hooks/courses/useCreateCourseForm";

const errorClass = "mt-1 text-sm text-red-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-2";

// Helper function to get errors for a specific topic
const getTopicErrors = (errors: Partial<FormData>, index: number) => {
  // Ensure errors.topics exists and is an array, then return the error object for the specific index
  if (errors.topics && Array.isArray(errors.topics) && errors.topics[index]) {
    // We need to ensure the type is compatible with what TopicForm expects
    // Based on our FormErrors type, errors.topics[index] could be Partial<Topic>
    return errors.topics[index] as any; // Use any for simplicity here, or define a more specific TopicErrors type
  }
  return undefined;
};

const CreateCourse = () => {
  const navigate = useNavigate();
  const menu = useTeacherMenu();
  const { teacher, loading: teacherLoading } = useTeacher();
  const displayName = teacherLoading
    ? "Giáo viên"
    : teacher?.name || "Giáo viên";

  const {
    loading,
    error,
    success,
    formData,
    errors,
    imageUrl,
    imageUploading,
    handleChange,
    handleTopicChange,
    handleAddTopic,
    handleAddMaterial,
    handleMaterialChange,
    handleRemoveMaterial,
    handleRemoveTopic,
    handleImageChange,
    handleSubmit,
  } = useCreateCourseForm(teacher, navigate);

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
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Tạo khóa học mới
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo một khóa học mới với đầy đủ thông tin
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              Tạo khóa học thành công! Đang chuyển hướng...
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Thông tin cơ bản
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className={labelClass}>Tên khóa học</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Ví dụ: React Fundamentals"
                        disabled={loading}
                      />
                      {errors.name && (
                        <p className={errorClass}>{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Mô tả</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Mô tả chi tiết về khóa học..."
                        disabled={loading}
                      />
                      {errors.description && (
                        <p className={errorClass}>{errors.description}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Mật khẩu khóa học</label>
                      <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập mật khẩu cho học viên đăng ký"
                        disabled={loading}
                      />
                      {errors.password && (
                        <p className={errorClass}>{errors.password}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Ảnh khóa học</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={imageUploading || loading}
                        className="mb-2"
                      />
                      {imageUploading && (
                        <div className="text-sm text-gray-500">
                          Đang tải ảnh...
                        </div>
                      )}
                      {imageUrl && (
                        <div className="mt-2">
                          <img
                            src={imageUrl}
                            alt="Ảnh khóa học"
                            className="h-32 rounded shadow border object-cover"
                            style={{ maxWidth: 240 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="space-y-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Nội dung khóa học
                    </h2>
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      disabled={loading}
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

                  <div className="space-y-4">
                    {formData.topics.map((topic, index) => (
                      <TopicForm
                        key={index}
                        topic={topic}
                        topicErrors={getTopicErrors(errors, index)}
                        onChange={(field, value) =>
                          handleTopicChange(index, field as any, value)
                        }
                        onRemove={() => handleRemoveTopic(index)}
                        onAddMaterial={() => handleAddMaterial(index)}
                        onMaterialChange={(materialIndex, field, value) =>
                          handleMaterialChange(
                            index,
                            materialIndex,
                            field as any,
                            value
                          )
                        }
                        onRemoveMaterial={(materialIndex) =>
                          handleRemoveMaterial(index, materialIndex)
                        }
                        disabled={loading}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-green-700"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : (
                      "Tạo khóa học"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;
