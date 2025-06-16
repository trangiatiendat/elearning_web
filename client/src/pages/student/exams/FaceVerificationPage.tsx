import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FaceVerificationPage: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    setLoading(true);
    setError("");
    const canvas = document.createElement("canvas");
    const video = videoRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    try {
      navigate(`/student/exams/${examId}/start`);
    } catch (err) {
      setError("Xác thực khuôn mặt thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-indigo-100 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Xác thực khuôn mặt</h2>
        <video
          ref={videoRef}
          autoPlay
          className="rounded-lg w-full max-w-xs mb-4"
        />
        <button
          onClick={handleCapture}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Đang xác thực..." : "Xác thực & Vào thi"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default FaceVerificationPage;
