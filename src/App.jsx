import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Pages/Layout/Layout";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Home from "./Pages/Home/Home";
import ProtectedRoutes from "./Pages/ProtectedRoutes/ProtectedRoutes";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import AddTask from "./Pages/AddTasks/AddTask";
import { useEffect, useState } from "react";
import { connectSocket } from "./utils/socketClient";
import NotFound from "./Pages/NotFound/NotFound";
import TasksPage from "./Pages/TaskPage/TaskPage";
import NotificationList from "./Components/NotificationList";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
  }, [token]);

  const routes = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          ),
        },
        {
          path: "home",
          element: (
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          ),
        },
        {
          path: "add-task",
          element: (
            <ProtectedRoutes>
              <AddTask />
            </ProtectedRoutes>
          ),
        },

        {
          path: "get-tasks",
          element: (
            <ProtectedRoutes>
              <TasksPage />
            </ProtectedRoutes>
          ),
        },
        { path: "login", element: <Login /> },
        { path: "register", element: <Signup /> },
        { path: "logout", element: <Login /> },
        { path: "reset/:token", element: <ResetPassword /> },
        { path: "forgot", element: <ForgotPassword /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
