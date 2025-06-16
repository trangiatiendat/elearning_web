import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const FaceVerificationModal = ({
  examId,
  onSuccess,
  onClose,
}: {
  examId: number | string;
  onSuccess: () => void;
  onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      await axios.post(
        `/api/exams/${examId}/face-verification`,
        { image: dataUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onSuccess();
    } catch (err: any) {
      setError("Khuôn mặt không phù hợp. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-indigo-100 flex flex-col items-center relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
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

export default FaceVerificationModal;
