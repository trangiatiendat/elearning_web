import { useState } from "react";
import axios from "axios";
import { Material } from "../../types/course";
import { Course } from "../../types/course";

interface UseMaterialManagementProps {
  setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export function useMaterialManagement({
  setCourse,
  setError,
}: UseMaterialManagementProps) {
  // State cho thao tác tài liệu
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(
    null
  );
  const [materialDraft, setMaterialDraft] = useState<Partial<Material>>({});
  const [addingMaterialTopicId, setAddingMaterialTopicId] = useState<
    number | null
  >(null);

  // Tài liệu
  const handleAddMaterial = async (topicId: number) => {
    try {
      const res = await axios.post("/api/course-materials", {
        topic_id: topicId,
        type: materialDraft.type,
        title: materialDraft.title,
        url: materialDraft.url,
      });
      setCourse(
        (prev) =>
          prev && {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId
                ? { ...t, materials: [...t.materials, res.data] }
                : t
            ),
          }
      );
      setMaterialDraft({});
      setAddingMaterialTopicId(null);
    } catch (err) {
      setError("Không thể thêm tài liệu");
    }
  };

  const handleEditMaterial = async (materialId: number, topicId: number) => {
    try {
      await axios.put(`/api/course-materials/${materialId}`, materialDraft);
      setCourse(
        (prev) =>
          prev && {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    materials: t.materials.map((m) =>
                      m.id === materialId ? { ...m, ...materialDraft } : m
                    ),
                  }
                : t
            ),
          }
      );
      setEditingMaterialId(null);
      setMaterialDraft({});
    } catch (err) {
      setError("Không thể sửa tài liệu");
    }
  };

  const handleDeleteMaterial = async (materialId: number, topicId: number) => {
    try {
      await axios.delete(`/api/course-materials/${materialId}`);
      setCourse(
        (prev) =>
          prev && {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    materials: t.materials.filter((m) => m.id !== materialId),
                  }
                : t
            ),
          }
      );
    } catch (err) {
      setError("Không thể xóa tài liệu");
    }
  };

  return {
    addingMaterialTopicId,
    setAddingMaterialTopicId,
    materialDraft,
    setMaterialDraft,
    handleAddMaterial,
    editingMaterialId,
    setEditingMaterialId,
    handleEditMaterial,
    handleDeleteMaterial,
  };
}
