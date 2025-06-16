import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  getTopicsByCourseId,
} from "../../services/courseService";
import { Course, Topic, Material } from "../../types/course";
import axios from "axios";
import { useTopicManagement } from "./useTopicManagement";
import { useMaterialManagement } from "./useMaterialManagement";

export function useTeacherCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Use the new hook for topic management
  const courseId = course?.id || 0;

  // Use the new hook for material management

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getCourseById(Number(id));
          console.log("Course data from getCourseById:", data);
          // Nếu không có topics hoặc topics rỗng, gọi thêm API lấy topics
          let courseWithTopics = data;
          if (!data.topics || data.topics.length === 0) {
            const topics = await getTopicsByCourseId(Number(id));
            console.log("Topics data from getTopicsByCourseId:", topics);
            courseWithTopics = { ...data, topics };
          }
          // Đảm bảo mỗi topic đều có materials là mảng
          if (courseWithTopics.topics) {
            courseWithTopics.topics = courseWithTopics.topics.map(
              (topic: any) => ({
                ...topic,
                materials: Array.isArray(topic.materials)
                  ? topic.materials
                  : [],
              })
            );
          }
          setCourse(courseWithTopics);
        }
      } catch (err) {
        alert("Không tìm thấy khóa học!");
        navigate("/teacher/courses/manage");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  return {
    course,
    loading,
    error,
    setError,
    navigate,
    // Spread the results from the management hooks
    ...useTopicManagement({ courseId, setCourse, setError }),
    ...useMaterialManagement({ setCourse, setError }),
  };
}
