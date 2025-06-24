import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store.js";
import { Provider } from "react-redux";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import Login from "./pages/authentication/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Summarize from "./pages/summaries/Summarize.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminPanel from "./pages/admin/AdminPanel.jsx";
import EditorDashboard from "./pages/dashboard/EditorDashboard.jsx";
import ReviewerDashboard from "./pages/dashboard/ReviewerDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        element: (
          <PrivateRoute
            requiredRoles={["user", "admin", "editor", "reviewer"]}
          />
        ),
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/summarize",
            element: <Summarize />,
          },
        ],
      },
      {
        element: <PrivateRoute requiredRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminPanel />,
          },
        ],
      },
      {
        element: <PrivateRoute requiredRoles={["editor"]} />,
        children: [
          {
            path: "/editor",
            element: <EditorDashboard />,
          },
        ],
      },
      {
        element: <PrivateRoute requiredRoles={["reviewer"]} />,
        children: [
          {
            path: "/reviewer",
            element: <ReviewerDashboard />,
          },
        ],
      },
      {
        path: "/unauthorized",
        element: <div>Unauthorized</div>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
