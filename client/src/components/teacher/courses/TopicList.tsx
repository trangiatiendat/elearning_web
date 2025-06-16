import React from "react";
import TopicItem from "./TopicItem";
import { Topic, Material } from "../../../types/course";

export interface TopicListProps {
  topics: Topic[];
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

const TopicList: React.FC<TopicListProps> = ({ topics, ...props }) => (
  <div className="space-y-4">
    {topics.map((topic, index) => (
      <TopicItem key={topic.id} topic={topic} index={index} {...props} />
    ))}
  </div>
);

export default TopicList;
