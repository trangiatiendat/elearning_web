import { Navigate, Outlet } from "react-router-dom";
import StudentDashboard from "../pages/student/StudentDashboard";
import Assignment from "../pages/student/assignments/AssignmentPage";
import AccountPage from "../pages/student/AccountPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RegisteredCoursesPage from "../pages/student/courses/RegisteredCoursesPage";
import UnregisteredCoursesPage from "../pages/student/courses/UnregisteredCoursesPage";
import CourseDetailPage from "../pages/student/courses/CourseDetailPage";
import ExamListPage from "../pages/student/exams/ExamListPage";
import FaceVerificationPage from "../pages/student/exams/FaceVerificationPage";
import ExamStartPage from "../pages/student/exams/ExamStartPage";
import ExamResultPage from "../pages/student/exams/ExamResultPage";

const studentRoutes = [
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/student/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "courses",
        children: [
          {
            index: true,
            element: <Navigate to="/student/courses/registered" replace />,
          },
          {
            path: "registered",
            element: <RegisteredCoursesPage />,
          },
          {
            path: "unregistered",
            element: <UnregisteredCoursesPage />,
          },
          {
            path: ":courseId",
            element: <CourseDetailPage />,
          },
        ],
      },
      {
        path: "assignments",
        element: <Assignment />,
      },
      {
        path: "assignments/submitted",
        element: <Assignment />,
      },
      {
        path: "exams",
        element: <ExamListPage />,
      },
      {
        path: "exams/:examId/face-verification",
        element: <FaceVerificationPage />,
      },
      {
        path: "exams/:examId/start",
        element: <ExamStartPage />,
      },
      {
        path: "exams/results",
        element: <ExamResultPage />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
    ],
  },
];

export default studentRoutes;
