import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import App from "../layout/App";
import AboutPage from "../../features/about/AboutPage";
import Layout from "../layout/Layout";
import { useEffect } from "react";
import Login from "../../features/account/Login";
import OnlineStudy from "../../features/onlineStudy/OnlineStudy";
import CourseList from "../../features/onlineStudy/CourseList";
import Course from "../../features/onlineStudy/Course";
import RequireAuth from "../components/RequireAuth";
import ProfilePage from "../../features/profile/ProfilePage";
import ForumPage from "../../features/forum/ForumPage";
import Theme from "../../features/forum/Theme";
import Themes from "../../features/forum/Themes";

const ExternalRedirect = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.replace(url);
  }, []);
  return null;
};

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "about",
            element: <AboutPage />,
          },
          {
            path: "etfis",
            element: <ExternalRedirect url="https://www.etf.ues.rs.ba/" />,
          },
          {
            path: "onlineStudy",
            element: <OnlineStudy />,
          },
          {
            path: "courses",
            element: <CourseList />, // Komponenta koja prikazuje kurseve
          },
          {
            path: "courses/:id",
            element: <Course />,
          },
          {
            path: "profile",
            element: (
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            ),
          },
          {
            path: "forum",
            element: <ForumPage />,
          },
          {
            path: "forum/:id",
            element: <Theme />,
          },
          {
            path: "themes",
            element: <Themes />, // Komponenta koja prikazuje teme
          },
        ],
      },
    ],
  },
]);
