import React from "react";
import MaterialList from "./MaterialList";
import { Topic, Material } from "../../../types/course";

export interface TopicItemProps {
  topic: Topic;
  index: number;
  editingTopicId: number | null;
  setEditingTopicId: React.Dispatch<React.SetStateAction<number | null>>;
  topicDraft: Partial<Topic>;
  setTopicDraft: React.Dispatch<React.SetStateAction<Partial<Topic>>>;
  handleEditTopic: (topicId: number) => void;
  handleDeleteTopic: (topicId: number) => void;
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

const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  index,
  editingTopicId,
  setEditingTopicId,
  topicDraft,
  setTopicDraft,
  handleEditTopic,
  handleDeleteTopic,
  addingMaterialTopicId,
  setAddingMaterialTopicId,
  materialDraft,
  setMaterialDraft,
  handleAddMaterial,
  editingMaterialId,
  setEditingMaterialId,
  handleEditMaterial,
  handleDeleteMaterial,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">Chủ đề {index + 1}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingTopicId(topic.id);
              setTopicDraft(topic);
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
            onClick={() => handleDeleteTopic(topic.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
      </div>
      {editingTopicId === topic.id ? (
        <div className="grid gap-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={topicDraft.title || ""}
            onChange={(e) =>
              setTopicDraft({ ...topicDraft, title: e.target.value })
            }
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={topicDraft.description || ""}
            onChange={(e) =>
              setTopicDraft({ ...topicDraft, description: e.target.value })
            }
          />
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => handleEditTopic(topic.id)}
            >
              Lưu
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => {
                setEditingTopicId(null);
                setTopicDraft({});
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={topic.title}
            disabled
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={topic.description}
            disabled
          />
        </div>
      )}
      <MaterialList
        materials={topic.materials || []}
        topicId={topic.id}
        addingMaterialTopicId={addingMaterialTopicId}
        setAddingMaterialTopicId={setAddingMaterialTopicId}
        materialDraft={materialDraft}
        setMaterialDraft={setMaterialDraft}
        handleAddMaterial={handleAddMaterial}
        editingMaterialId={editingMaterialId}
        setEditingMaterialId={setEditingMaterialId}
        handleEditMaterial={handleEditMaterial}
        handleDeleteMaterial={handleDeleteMaterial}
      />
    </div>
  );
};

export default TopicItem;
