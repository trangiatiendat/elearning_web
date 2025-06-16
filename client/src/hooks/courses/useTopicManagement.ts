import { useState } from "react";
import axios from "axios";
import { Topic } from "../../types/course";
import { Course } from "../../types/course"; // Import Course type for setCourse type hint

interface UseTopicManagementProps {
  courseId: number;
  setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export function useTopicManagement({
  courseId,
  setCourse,
  setError,
}: UseTopicManagementProps) {
  // State cho thao tác chủ đề
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [topicDraft, setTopicDraft] = useState<Partial<Topic>>({});
  const [addingTopic, setAddingTopic] = useState(false);

  // Chủ đề
  const handleAddTopic = async () => {
    if (!courseId) return;
    try {
      const res = await axios.post("/api/course-topics", {
        course_id: courseId,
        title: topicDraft.title,
        description: topicDraft.description,
      });
      setCourse(
        (prev) =>
          prev && {
            ...prev,
            topics: [...prev.topics, { ...res.data, materials: [] }],
          }
      );
      setTopicDraft({});
      setAddingTopic(false);
    } catch (err) {
      setError("Không thể thêm chủ đề");
    }
  };

  const handleEditTopic = async (topicId: number) => {
    try {
      await axios.put(`/api/course-topics/${topicId}`, topicDraft);
      setCourse(
        (prev) =>
          prev && {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId ? { ...t, ...topicDraft } : t
            ),
          }
      );
      setEditingTopicId(null);
      setTopicDraft({});
    } catch (err) {
      setError("Không thể sửa chủ đề");
    }
  };

  const handleDeleteTopic = async (topicId: number) => {
    try {
      await axios.delete(`/api/course-topics/${topicId}`);
      setCourse(
        (prev) =>
          prev && {
            ...prev,
            topics: prev.topics.filter((t) => t.id !== topicId),
          }
      );
    } catch (err) {
      setError("Không thể xóa chủ đề");
    }
  };

  return {
    editingTopicId,
    setEditingTopicId,
    topicDraft,
    setTopicDraft,
    addingTopic,
    setAddingTopic,
    handleAddTopic,
    handleEditTopic,
    handleDeleteTopic,
  };
}
