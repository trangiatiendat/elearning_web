import { createBrowserRouter } from "react-router-dom";
import homepageRoutes from "./homepageRoutes";
import studentRoutes from "./studentRoutes";
import teacherRoutes from "./teacherRoutes";

export const router = createBrowserRouter([
  ...homepageRoutes,
  ...studentRoutes,
  ...teacherRoutes,
]);
