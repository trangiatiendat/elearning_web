import React from "react";
import { Material } from "../../../types/course";

export interface MaterialItemProps {
  mat: Material;
  topicId: number;
  editingMaterialId: number | null;
  setEditingMaterialId: React.Dispatch<React.SetStateAction<number | null>>;
  materialDraft: Partial<Material>;
  setMaterialDraft: React.Dispatch<React.SetStateAction<Partial<Material>>>;
  handleEditMaterial: (materialId: number, topicId: number) => void;
  handleDeleteMaterial: (materialId: number, topicId: number) => void;
}

const MaterialItem: React.FC<MaterialItemProps> = ({
  mat,
  topicId,
  editingMaterialId,
  setEditingMaterialId,
  materialDraft,
  setMaterialDraft,
  handleEditMaterial,
  handleDeleteMaterial,
}) => (
  <div className="flex gap-3 items-start bg-white p-3 rounded border">
    {editingMaterialId === mat.id ? (
      <>
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
          value={materialDraft.title || ""}
          onChange={(e) =>
            setMaterialDraft({ ...materialDraft, title: e.target.value })
          }
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={materialDraft.url || ""}
          onChange={(e) =>
            setMaterialDraft({ ...materialDraft, url: e.target.value })
          }
        />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => handleEditMaterial(mat.id, topicId)}
        >
          Lưu
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          onClick={() => {
            setEditingMaterialId(null);
            setMaterialDraft({});
          }}
        >
          Hủy
        </button>
      </>
    ) : (
      <>
        <select
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={mat.type}
          disabled
        >
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="other">Khác</option>
        </select>
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={mat.title}
          disabled
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={mat.url}
          disabled
        />
        {mat.id && (
          <>
            <button
              type="button"
              onClick={() => {
                setEditingMaterialId(mat.id);
                setMaterialDraft(mat);
              }}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleDeleteMaterial(mat.id, topicId)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </>
        )}
      </>
    )}
  </div>
);

export default MaterialItem;
