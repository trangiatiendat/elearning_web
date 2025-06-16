import { Navigate, Outlet } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import ManageCourses from "../pages/teacher/courses/ManageCourses";
import CreateCourse from "../pages/teacher/courses/CreateCourse";
import AssignmentsManagement from "../pages/teacher/assignments/AssignmentsManagement";
import AccountPage from "../pages/teacher/AccountPage";
import ProtectedRoute from "../components/ProtectedRoute";
import CourseDetail from "../pages/teacher/courses/CourseDetail";
import EditCourse from "../pages/teacher/courses/EditCourse";
import CreateAssignment from "../pages/teacher/assignments/CreateAssignment";
import EditAssignment from "../pages/teacher/assignments/EditAssignment";
import SubmissionListPage from "../pages/teacher/assignments/SubmissionListPage";
import ExamListPage from "../pages/teacher/exams/ExamListPage";
import ExamCreatePage from "../pages/teacher/exams/ExamCreatePage";
import ExamDetailPage from "../pages/teacher/exams/ExamDetailPage";
import ExamResultsManagement from "../pages/teacher/exams/ExamResultsManagement";
import StudentsByCoursePage from "../pages/teacher/courses/StudentsByCoursePage";
const teacherRoutes = [
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/teacher/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <TeacherDashboard />,
      },
      {
        path: "courses",
        children: [
          {
            index: true,
            element: <Navigate to="/teacher/courses/manage" replace />,
          },
          {
            path: "manage",
            element: <ManageCourses />,
          },
          {
            path: "create",
            element: <CreateCourse />,
          },
          {
            path: ":id",
            element: <CourseDetail />,
          },
          {
            path: "edit/:id",
            element: <EditCourse />,
          },
        ],
      },
      {
        path: "assignments",
        children: [
          {
            index: true,
            element: <AssignmentsManagement />,
          },
          {
            path: "create",
            element: <CreateAssignment />,
          },
          {
            path: ":id/edit",
            element: <EditAssignment />,
          },
          {
            path: "grading",
            element: <SubmissionListPage />,
          },
        ],
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "exams",
        children: [
          { path: "", element: <ExamListPage /> },
          { path: "create", element: <ExamCreatePage /> },
          { path: ":id", element: <ExamDetailPage /> },
        ],
      },
      {
        path: "exam-results",
        element: <ExamResultsManagement />,
      },
      {
        path: "students",
        children: [{ path: "by-course", element: <StudentsByCoursePage /> }],
      },
    ],
  },
];

export default teacherRoutes;
