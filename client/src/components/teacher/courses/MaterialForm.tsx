import { FormData } from "../../../hooks/courses/useCreateCourseForm"; // Import FormData for typing

const inputClass =
  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";

// Define a type for material-specific errors, handling potential undefined 'materials'
type MaterialErrors = Partial<
  NonNullable<FormData["topics"][number]["materials"]>[number]
>;

const MaterialForm = ({
  material,
  onChange,
  onRemove,
  disabled,
  materialErrors, // Add materialErrors prop
}: {
  material: any;
  onChange: (field: string, value: string) => void;
  onRemove: () => void;
  disabled: boolean;
  index: number;
  topicIndex: number;
  materialErrors?: MaterialErrors; // Define the type for materialErrors
}) => (
  <div className="flex gap-3 items-start bg-white p-3 rounded border">
    <div className="flex-1 grid grid-cols-4 gap-3">
      <div>
        <select
          value={material.type}
          onChange={(e) => onChange("type", e.target.value)}
          className={inputClass}
          disabled={disabled}
        >
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="other">Khác</option>
        </select>
      </div>
      <div className="col-span-2">
        <input
          type="text"
          value={material.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Tiêu đề tài liệu"
          className={`${inputClass} ${
            materialErrors?.title ? "border-red-500" : "border-gray-300"
          }`}
          disabled={disabled}
        />
        {materialErrors?.title && (
          <p className="mt-1 text-sm text-red-500">{materialErrors.title}</p>
        )}
      </div>
      <div className="col-span-2">
        <input
          type="text"
          value={material.url}
          onChange={(e) => onChange("url", e.target.value)}
          placeholder={
            material.type === "video" ? "URL YouTube" : "URL tài liệu"
          }
          className={`${inputClass} ${
            materialErrors?.url ? "border-red-500" : "border-gray-300"
          }`}
          disabled={disabled}
        />
        {materialErrors?.url && (
          <p className="mt-1 text-sm text-red-500">{materialErrors.url}</p>
        )}
      </div>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="p-2 text-red-500 hover:bg-red-50 rounded"
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
);

export default MaterialForm;
