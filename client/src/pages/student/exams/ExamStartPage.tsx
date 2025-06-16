import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m} : ${s}`;
};

const ExamStartPage: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Lấy đề thi và câu hỏi
  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/exams/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setExam(res.data);
        setTimeLeft(res.data.duration_minutes * 60);
      } catch (err) {
        setError("Không thể tải đề thi");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
    // eslint-disable-next-line
  }, [examId]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Hết giờ tự động nộp bài
  useEffect(() => {
    if (timeLeft === 0 && exam) handleSubmit();
    // eslint-disable-next-line
  }, [timeLeft]);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await axios.post(
        `/api/exams/${examId}/submit`,
        { answers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Nộp bài thành công!");
      navigate("/student/exams");
    } catch (err) {
      alert("Nộp bài thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải đề thi...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!exam) return null;

  const questions = exam.questions || [];
  const currentQuestion = questions[current];

  return (
    <div className="bg-gray-50 min-h-screen p-0">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto pt-6 gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <button
              className="text-blue-600 font-semibold px-2 py-1 rounded hover:bg-blue-50"
              onClick={() => navigate("/student/exams")}
            >
              &lt; Quay lại
            </button>
            <div className="text-lg font-bold">
              Thí sinh: {exam.student_name || "zzzzzzzzzz"}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-indigo-700 font-bold text-lg">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTime(timeLeft)}
              </div>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
                onClick={handleSubmit}
                disabled={submitting}
              >
                Nộp bài
              </button>
            </div>
          </div>
          {/* Danh sách câu hỏi */}
          {questions.map((q: any, idx: number) => (
            <div key={q.id} className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="font-bold mb-2">Câu {idx + 1}</div>
              <div className="mb-4 text-base font-semibold">{q.content}</div>
              <div className="mb-2 text-gray-500">Chọn một đáp án đúng</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt: string, oidx: number) => (
                  <button
                    key={oidx}
                    className={`text-left px-4 py-2 rounded-lg border font-medium transition-colors
                      ${
                        answers[q.id] === String.fromCharCode(65 + oidx)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-indigo-50"
                      }
                    `}
                    onClick={() =>
                      handleSelect(q.id, String.fromCharCode(65 + oidx))
                    }
                  >
                    <span className="font-bold mr-2">
                      {String.fromCharCode(65 + oidx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar danh sách câu hỏi */}
        <div className="w-full md:w-64">
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="font-bold mb-2">Danh sách câu hỏi</div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q: any, idx: number) => (
                <button
                  key={q.id}
                  className={`w-10 h-10 rounded text-sm font-bold border
                    ${
                      current === idx
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : answers[q.id]
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }
                  `}
                  onClick={() => setCurrent(idx)}
                >
                  {(idx + 1).toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamStartPage;
