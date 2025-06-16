import {
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

export const useStudentMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return [
    {
      label: "Dashboard",
      icon: <HomeIcon className="h-6 w-6" />,
      to: "/student/dashboard",
      active: currentPath === "/student/dashboard",
      onClick: () => navigate("/student/dashboard"),
    },
    {
      label: "Khóa học",
      icon: <BookOpenIcon className="h-6 w-6" />,
      to: "/student/courses/registered",
      active: currentPath.startsWith("/student/courses"),
      onClick: () => navigate("/student/courses/registered"),
      submenu: [
        {
          label: "Khóa học đã đăng ký",
          icon: <BookOpenIcon className="h-5 w-5" />,
          to: "/student/courses/registered",
          active: currentPath === "/student/courses/registered",
          onClick: () => navigate("/student/courses/registered"),
        },
        {
          label: "Khóa học chưa đăng ký",
          icon: <BookOpenIcon className="h-5 w-5" />,
          to: "/student/courses/unregistered",
          active: currentPath === "/student/courses/unregistered",
          onClick: () => navigate("/student/courses/unregistered"),
        },
      ],
    },
    {
      label: "Bài tập",
      icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
      to: "/student/assignments",
      active: currentPath.startsWith("/student/assignments"),
    },
    {
      label: "Kiểm tra",
      icon: <AcademicCapIcon className="h-6 w-6" />,
      to: "/student/exams",
      active: currentPath.startsWith("/student/exams"),
      onClick: () => navigate("/student/exams"),
      submenu: [
        {
          label: "Danh sách kiểm tra",
          icon: <AcademicCapIcon className="h-5 w-5" />,
          to: "/student/exams",
          active: currentPath === "/student/exams",
          onClick: () => navigate("/student/exams"),
        },
        {
          label: "Kết quả thi",
          icon: <AcademicCapIcon className="h-5 w-5" />,
          to: "/student/exams/results",
          active: currentPath === "/student/exams/results",
          onClick: () => navigate("/student/exams/results"),
        },
      ],
    },
    {
      label: "Tài khoản",
      icon: <UserCircleIcon className="h-6 w-6" />,
      to: "/student/account",
      active: currentPath === "/student/account",
      onClick: () => navigate("/student/account"),
    },
  ];
};
