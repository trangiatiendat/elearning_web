import { useState, useEffect } from "react";
import { getStudentExams, getMyExamResults } from "../../services/examService";
import { getRegisteredCourses } from "../../services/courseService";

function getExamStatus(exam: any) {
  const now = new Date();
  const start = new Date(exam.start_time);
  const end = new Date(exam.end_time);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "completed";
  return "unknown";
}

export function useStudentExamList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [registeredCourseIds, setRegisteredCourseIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, coursesData, resultsData] = await Promise.all([
          getStudentExams(),
          getRegisteredCourses(),
          getMyExamResults(),
        ]);
        const examsWithResult = examsData.map((exam: any) => {
          const result = resultsData.find((r: any) => r.exam_id === exam.id);
          return {
            ...exam,
            isTaken: !!result,
            score: result?.score ?? null,
          };
        });
        setExams(examsWithResult);
        setRegisteredCourseIds(coursesData.map((c: any) => c.id));
      } catch (error) {
        setExams([]);
        setRegisteredCourseIds([]);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchData();
  }, []);

  const filteredExams = exams.filter(
    (exam) =>
      registeredCourseIds.includes(exam.course_id) &&
      exam.title.toLowerCase().includes(search.toLowerCase()) &&
      (status === "" || getExamStatus(exam) === status)
  );

  return {
    search,
    setSearch,
    status,
    setStatus,
    exams,
    loadingExams,
    filteredExams,
  };
}
