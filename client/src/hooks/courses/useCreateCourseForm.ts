import { useState } from "react";
import axios from "axios";
import { z, ZodError } from "zod";

// Define Zod Schemas
const materialSchema = z.object({
  type: z.enum(["video", "pdf", "other"]),
  title: z.string().min(1, "Tiêu đề tài liệu không được để trống"),
  url: z
    .string()
    .min(1, "URL tài liệu không được để trống")
    .url("URL tài liệu không hợp lệ"),
});

const topicSchema = z.object({
  title: z.string().min(1, "Tiêu đề chủ đề không được để trống"),
  description: z.string().optional(),
  materials: z.array(materialSchema).optional(),
});

const courseFormSchema = z.object({
  name: z.string().min(5, "Tên khóa học phải có ít nhất 5 ký tự"),
  description: z.string().min(20, "Mô tả khóa học phải có ít nhất 20 ký tự"),
  image_url: z.string().optional(),
  password: z.string().min(4, "Mật khẩu phải có ít nhất 4 ký tự"),
  topics: z.array(topicSchema).min(1, "Khóa học phải có ít nhất một chủ đề"),
});

// Infer FormData type from schema
export type FormData = z.infer<typeof courseFormSchema>;

// Helper to format Zod errors into a nested structure matching the form data shape
const formatZodErrors = (errors: ZodError) => {
  const fieldErrors: any = {};
  errors.errors.forEach((err) => {
    let current = fieldErrors;
    for (let i = 0; i < err.path.length; i++) {
      const p = err.path[i];
      if (i === err.path.length - 1) {
        // Assign the error message at the final path segment
        // If there are multiple errors for the same field, store as an array
        if (current[p] && !Array.isArray(current[p])) {
          current[p] = [current[p]];
        }
        if (Array.isArray(current[p])) {
          current[p].push(err.message);
        } else {
          current[p] = err.message;
        }
      } else {
        // Traverse or create nested object/array
        if (!current[p]) {
          // Check if the next part of the path is a number (array index)
          if (typeof err.path[i + 1] === "number") {
            current[p] = []; // Create an array
          } else {
            current[p] = {}; // Create an object
          }
        }
        current = current[p]; // Move deeper into the structure
      }
    }
  });
  return fieldErrors;
};

// Update the type of errors state to match the nested structure
type FormErrors = Partial<FormData>; // Use Partial<FormData> for a more accurate type

export function useCreateCourseForm(teacher: any, navigate: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    password: "",
    topics: [],
  });
  // Use the new error type
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Refactored validateForm using Zod
  const validateForm = (): boolean => {
    const result = courseFormSchema.safeParse(formData);
    if (!result.success) {
      // Format Zod errors using the helper
      const fieldErrors = formatZodErrors(result.error);
      setErrors(fieldErrors);
      // Keep a generic error message at the top or handle specific top-level errors if needed
      setError("Vui lòng kiểm tra các lỗi trong form.");
    } else {
      setErrors({}); // Clear errors on success
      setError("");
    }
    return result.success;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear specific field error when changing
    // Use type assertion for clearer error clearing based on top-level keys
    if (name in errors) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors]; // Use type assertion here
        return newErrors;
      });
    }
    // Clear general topics error if any topic field is changed
    if (name.startsWith("topics[")) {
      // Note: Clearing nested errors requires more complex logic than this simple check.
      // This currently only clears a top-level 'topics' error if it exists and is not an array.
      if (errors.topics && !Array.isArray(errors.topics)) {
        // Check if it's the general error
        setErrors((prev) => ({ ...prev, topics: undefined }));
      }
    }
    setError("");
  };

  const handleTopicChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.map((topic, i) =>
        i === index ? { ...topic, [field]: value } : topic
      ),
    }));
    if (errors.topics) {
      setErrors((prev) => ({ ...prev, topics: undefined }));
    }
    setError("");
  };

  const handleAddTopic = () => {
    setFormData((prev) => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          title: "",
          description: "",
          materials: [],
        },
      ],
    }));
    if (errors.topics) {
      setErrors((prev) => ({ ...prev, topics: undefined }));
    }
    setError("");
  };

  const handleAddMaterial = (topicIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.map((topic, idx) =>
        idx === topicIndex
          ? {
              ...topic,
              materials: [
                ...(topic.materials || []),
                {
                  type: "video",
                  title: "",
                  url: "",
                },
              ],
            }
          : topic
      ),
    }));
    if (errors.topics) {
      setErrors((prev) => ({ ...prev, topics: undefined }));
    }
    setError("");
  };

  const handleMaterialChange = (
    topicIndex: number,
    materialIndex: number,
    field: "type" | "title" | "url",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.map((topic, idx) =>
        idx === topicIndex
          ? {
              ...topic,
              materials: (topic.materials || []).map((material, mIdx) =>
                mIdx === materialIndex
                  ? { ...material, [field]: value }
                  : material
              ),
            }
          : topic
      ),
    }));
    if (errors.topics) {
      setErrors((prev) => ({ ...prev, topics: undefined }));
    }
    setError("");
  };

  const handleRemoveMaterial = (topicIndex: number, materialIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.map((topic, idx) =>
        idx === topicIndex
          ? {
              ...topic,
              materials: (topic.materials || []).filter(
                (_, mIdx) => mIdx !== materialIndex
              ),
            }
          : topic
      ),
    }));
    if (errors.topics) {
      setErrors((prev) => ({ ...prev, topics: undefined }));
    }
    setError("");
  };

  const handleRemoveTopic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
    if (errors.topics) {
      setErrors((prev) => ({ ...prev, topics: undefined }));
    }
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file)); // Hiển thị preview
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!validateForm()) return;
    try {
      setLoading(true);
      if (!teacher?.id) {
        throw new Error("Bạn cần đăng nhập để tạo khóa học");
      }
      if (selectedImage) {
        // Có ảnh: gửi FormData
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("teacher_id", String(teacher.id));
        formDataToSend.append("topics", JSON.stringify(formData.topics));
        formDataToSend.append("image", selectedImage);
        await axios.post("/api/courses/teacher", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        // Không có ảnh: gửi JSON
        const dataToSend = {
          ...formData,
          teacher_id: teacher.id,
        };
        await axios.post("/api/courses/teacher", dataToSend, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/teacher/courses");
      }, 1500);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Có lỗi xảy ra khi tạo khóa học"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
