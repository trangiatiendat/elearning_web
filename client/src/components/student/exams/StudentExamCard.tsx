import React from "react";

const statusMap = {
  upcoming: { label: "Sắp diễn ra", color: "bg-yellow-100 text-yellow-800" },
  ongoing: { label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  completed: { label: "Đã kết thúc", color: "bg-gray-100 text-gray-800" },
  unknown: { label: "Không rõ", color: "bg-gray-100 text-gray-800" },
};

function getExamStatus(exam: any) {
  const now = new Date();
  const start = new Date(exam.start_time);
  const end = new Date(exam.end_time);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "completed";
  return "unknown";
}

function formatVietnamTime(isoString: string) {
  if (!isoString) return "";
  // Đảm bảo parse đúng nếu là 'YYYY-MM-DD HH:mm:ss'
  const date = new Date(
    isoString.includes("T") ? isoString : isoString.replace(" ", "T")
  );
  return date
    .toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    })
    .replace(",", "");
}

const StudentExamCard = ({
  exam,
  onStart,
}: {
  exam: any;
  onStart: () => void;
}) => {
  const status = getExamStatus(exam);
  const statusInfo = statusMap[status] || {
    label: "Không rõ",
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-white border border-green-100 rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col gap-3">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-bold text-green-800">{exam.title}</h3>
          <p className="text-sm text-gray-500">{exam.course_name}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>
      <div className="text-gray-700 text-sm mb-2 line-clamp-2">
        {exam.description}
      </div>
      <div className="flex flex-col gap-1 text-xs text-gray-600">
        <span>
          <b>Thời lượng:</b> {exam.duration_minutes} phút
        </span>
        <span>
          <b>Bắt đầu:</b> {formatVietnamTime(exam.start_time)}
        </span>
        <span>
          <b>Kết thúc:</b> {formatVietnamTime(exam.end_time)}
        </span>
      </div>
      <div className="mt-3">
        {exam.isTaken ? (
          <button
            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold w-full cursor-not-allowed"
            disabled
          >
            Đã thi
          </button>
        ) : status === "ongoing" ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full"
            onClick={onStart}
          >
            Bắt đầu thi
          </button>
        ) : (
          <button
            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold w-full cursor-not-allowed"
            disabled
          >
            {status === "upcoming" ? "Chưa đến giờ thi" : "Đã kết thúc"}
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentExamCard;
