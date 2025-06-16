import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService";
import { Course, Material } from "../../types/course";

interface UseStudentCourseDetailResult {
  course: Course | null;
  loading: boolean;
  error: string | null;
  currentVideoUrl: string | null;
  setCurrentVideoUrl: Dispatch<SetStateAction<string | null>>;
}

const useStudentCourseDetail = (): UseStudentCourseDetailResult => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = Number(courseId);
        if (isNaN(id)) {
          setError("Course ID không hợp lệ");
          setLoading(false);
          return;
        }
        const courseData: Course = await getCourseById(id);
        setCourse(courseData);

        // Set the first video material as the initial video if available
        if (
          courseData.topics &&
          courseData.topics.length > 0 &&
          courseData.topics[0].materials &&
          courseData.topics[0].materials.length > 0
        ) {
          const firstVideo = courseData.topics[0].materials.find(
            (mat: Material) => mat.type === "video" && mat.url
          );
          if (firstVideo) {
            setCurrentVideoUrl(firstVideo.url || null);
          }
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Không thể tải chi tiết khóa học.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  return { course, loading, error, currentVideoUrl, setCurrentVideoUrl };
};

export { useStudentCourseDetail };
