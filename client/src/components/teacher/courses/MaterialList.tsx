import React from "react";
import MaterialItem from "./MaterialItem";
import { Material } from "../../../types/course";

export interface MaterialListProps {
  materials: Material[];
  topicId: number;
  addingMaterialTopicId: number | null;
  setAddingMaterialTopicId: React.Dispatch<React.SetStateAction<number | null>>;
  materialDraft: Partial<Material>;
  setMaterialDraft: React.Dispatch<React.SetStateAction<Partial<Material>>>;
  handleAddMaterial: (topicId: number) => void;
  editingMaterialId: number | null;
  setEditingMaterialId: React.Dispatch<React.SetStateAction<number | null>>;
  handleEditMaterial: (materialId: number, topicId: number) => void;
  handleDeleteMaterial: (materialId: number, topicId: number) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  topicId,
  addingMaterialTopicId,
  setAddingMaterialTopicId,
  materialDraft,
  setMaterialDraft,
  handleAddMaterial,
  editingMaterialId,
  setEditingMaterialId,
  handleEditMaterial,
  handleDeleteMaterial,
}) => (
  <div className="mt-4">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-medium text-gray-700">Tài liệu học tập</h4>
      <button
        type="button"
        onClick={() => setAddingMaterialTopicId(topicId)}
        className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
      >
        Thêm tài liệu
      </button>
    </div>
    {addingMaterialTopicId === topicId && (
      <div className="flex gap-3 items-start bg-white p-3 rounded border mb-2">
        <select
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={materialDraft.type || ""}
          onChange={(e) =>
            setMaterialDraft({ ...materialDraft, type: e.target.value })
          }
        >
          <option value="">Chọn loại</option>
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="other">Khác</option>
        </select>
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tên tài liệu"
          value={materialDraft.title || ""}
          onChange={(e) =>
            setMaterialDraft({ ...materialDraft, title: e.target.value })
          }
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="URL"
          value={materialDraft.url || ""}
          onChange={(e) =>
            setMaterialDraft({ ...materialDraft, url: e.target.value })
          }
        />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => handleAddMaterial(topicId)}
        >
          Lưu
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          onClick={() => {
            setAddingMaterialTopicId(null);
            setMaterialDraft({});
          }}
        >
          Hủy
        </button>
      </div>
    )}
    <div className="space-y-3">
      {materials.map((mat) => (
        <MaterialItem
          key={mat.id}
          mat={mat}
          topicId={topicId}
          editingMaterialId={editingMaterialId}
          setEditingMaterialId={setEditingMaterialId}
          materialDraft={materialDraft}
          setMaterialDraft={setMaterialDraft}
          handleEditMaterial={handleEditMaterial}
          handleDeleteMaterial={handleDeleteMaterial}
        />
      ))}
    </div>
  </div>
);

export default MaterialList;
