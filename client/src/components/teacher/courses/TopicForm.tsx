import MaterialForm from "./MaterialForm";
import { FormData } from "../../../hooks/courses/useCreateCourseForm";

const inputClass =
  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";

type TopicErrors = Partial<FormData["topics"][number]>;

const TopicForm = ({
  topic,
  onChange,
  onRemove,
  onAddMaterial,
  onMaterialChange,
  onRemoveMaterial,
  disabled,
  index,
  topicErrors,
}: {
  topic: any;
  onChange: (field: string, value: string) => void;
  onRemove: () => void;
  onAddMaterial: () => void;
  onMaterialChange: (
    materialIndex: number,
    field: string,
    value: string
  ) => void;
  onRemoveMaterial: (materialIndex: number) => void;
  disabled: boolean;
  index: number;
  topicErrors?: TopicErrors;
}) => (
  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
    <div className="flex justify-between items-start">
      <h3 className="font-medium text-gray-800">Chủ đề {index + 1}</h3>
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        disabled={disabled}
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
    <div className="grid gap-4">
      <input
        type="text"
        value={topic.title}
        onChange={(e) => onChange("title", e.target.value)}
        placeholder="Tiêu đề chủ đề"
        className={`${inputClass} ${
          topicErrors?.title ? "border-red-500" : "border-gray-300"
        }`}
        disabled={disabled}
      />
      {topicErrors?.title && (
        <p className="mt-1 text-sm text-red-500">{topicErrors.title}</p>
      )}
      <textarea
        value={topic.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Mô tả chủ đề"
        rows={2}
        className={`${inputClass} ${
          topicErrors?.description ? "border-red-500" : "border-gray-300"
        }`}
        disabled={disabled}
      />
      {topicErrors?.description && (
        <p className="mt-1 text-sm text-red-500">{topicErrors.description}</p>
      )}
    </div>
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-700">Tài liệu học tập</h4>
        <button
          type="button"
          onClick={onAddMaterial}
          className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
          disabled={disabled}
        >
          Thêm tài liệu
        </button>
      </div>
      <div className="space-y-3">
        {topic.materials.map((material: any, mIndex: number) => (
          <MaterialForm
            key={mIndex}
            material={material}
            materialErrors={topicErrors?.materials?.[mIndex]}
            onChange={(field, value) => onMaterialChange(mIndex, field, value)}
            onRemove={() => onRemoveMaterial(mIndex)}
            disabled={disabled}
            index={mIndex}
            topicIndex={index}
          />
        ))}
      </div>
    </div>
  </div>
);

export default TopicForm;
