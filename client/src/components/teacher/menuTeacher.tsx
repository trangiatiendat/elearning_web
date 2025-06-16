import {
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  PlusCircleIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const useTeacherMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Memoize menu items to prevent unnecessary re-renders
  return useMemo(
    () => [
      {
        label: "Dashboard",
        icon: <HomeIcon className="h-6 w-6" />,
        to: "/teacher/dashboard",
        active: currentPath === "/teacher/dashboard",
      },
      {
        label: "Khóa học",
        icon: <BookOpenIcon className="h-6 w-6" />,
        to: "/teacher/courses",
        active: currentPath.startsWith("/teacher/courses"),
        submenu: [
          {
            label: "Quản lý khóa học",
            icon: <ListBulletIcon className="h-5 w-5" />,
            to: "/teacher/courses/manage",
            active: currentPath === "/teacher/courses/manage",
          },
          {
            label: "Tạo khóa học",
            icon: <PlusCircleIcon className="h-5 w-5" />,
            to: "/teacher/courses/create",
            active: currentPath === "/teacher/courses/create",
          },
        ],
      },
      {
        label: "Bài tập",
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        to: "/teacher/assignments",
        active: currentPath.startsWith("/teacher/assignments"),
        submenu: [
          {
            label: "Danh sách bài tập",
            icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
            to: "/teacher/assignments",
            active: currentPath === "/teacher/assignments",
          },
          {
            label: "Danh sách bài nộp",
            icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
            to: "/teacher/assignments/grading",
            active: currentPath === "/teacher/assignments/grading",
          },
        ],
      },
      {
        label: "Kiểm tra",
        icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
        to: "/teacher/exams",
        active:
          currentPath.startsWith("/teacher/exams") ||
          currentPath.startsWith("/teacher/exam-results"),
        submenu: [
          {
            label: "Quản lý kiểm tra",
            icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
            to: "/teacher/exams",
            active: currentPath === "/teacher/exams",
          },
          {
            label: "Kết quả thi của sinh viên",
            icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
            to: "/teacher/exam-results",
            active: currentPath.startsWith("/teacher/exam-results"),
          },
        ],
      },
      {
        label: "Học sinh",
        icon: <UserGroupIcon className="h-6 w-6" />,
        to: "/teacher/students/by-course",
        active: currentPath === "/teacher/students/by-course",
      },
      {
        label: "Tài khoản",
        icon: <UserCircleIcon className="h-6 w-6" />,
        to: "/teacher/account",
        active: currentPath === "/teacher/account",
      },
    ],
    [currentPath] // Only re-create menu when path changes
  );
};
