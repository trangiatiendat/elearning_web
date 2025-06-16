import { useEffect, useState } from "react";
import { getExamResultsByExamId } from "../../services/examService";
import { ExamResultWithStudent } from "../../types/exam";

export function useExamSubmissions(examId?: number | string) {
  const [submissions, setSubmissions] = useState<ExamResultWithStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    getExamResultsByExamId(Number(examId))
      .then((data) => setSubmissions(data))
      .catch((err) => setError(err.message || "Lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [examId]);

  return { submissions, loading, error };
}
