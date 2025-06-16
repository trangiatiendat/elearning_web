import Homepage from "../pages/Homepage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const homepageRoutes = [
  { path: "/", element: <Homepage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
];

export default homepageRoutes;
