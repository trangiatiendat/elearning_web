import { useState, useEffect } from "react";
import { getAllExams } from "../../services/examService";

function getExamStatus(exam: any) {
  const now = new Date();
  const start = new Date(exam.start_time);
  const end = new Date(exam.end_time);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "completed";
  return "unknown";
}

export function useExamList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getAllExams();
        setExams(data);
      } catch (error) {
        setExams([]);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter(
    (exam) =>
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
