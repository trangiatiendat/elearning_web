import SchoolIcon from "@mui/icons-material/School";
import BrushIcon from "@mui/icons-material/Brush";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const categories = [
  {
    name: "Lập trình",
    icon: (
      <SchoolIcon
        style={{ fontSize: 40 }}
        className="text-purple-500 transition-all"
      />
    ),
  },
  {
    name: "Thiết kế",
    icon: (
      <BrushIcon
        style={{ fontSize: 40 }}
        className="text-pink-400 transition-all"
      />
    ),
  },
  {
    name: "Kinh doanh",
    icon: (
      <BusinessCenterIcon
        style={{ fontSize: 40 }}
        className="text-green-500 transition-all"
      />
    ),
  },
  {
    name: "Âm nhạc",
    icon: (
      <MusicNoteIcon
        style={{ fontSize: 40 }}
        className="text-red-400 transition-all"
      />
    ),
  },
  {
    name: "Nhiếp ảnh",
    icon: (
      <CameraAltIcon
        style={{ fontSize: 40 }}
        className="text-blue-400 transition-all"
      />
    ),
  },
];

const CategoryList = () => (
  <div className="flex gap-8 overflow-x-auto py-4 mb-8 justify-center font-sans">
    {categories.map((cat) => (
      <div
        key={cat.name}
        className="min-w-[150px] px-6 py-8 flex flex-col items-center justify-center rounded-2xl cursor-pointer bg-gradient-to-br from-purple-100 to-blue-100 shadow-lg transition-all duration-200 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:bg-gradient-to-br hover:from-purple-200 hover:to-blue-200 group"
      >
        <span className="group-hover:scale-110 group-hover:text-purple-700 transition-all">
          {cat.icon}
        </span>
        <span className="font-extrabold mt-3 text-purple-800 text-center text-lg">
          {cat.name}
        </span>
      </div>
    ))}
  </div>
);

export default CategoryList;
