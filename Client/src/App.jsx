import { useContext } from "react";
import { Routes, Route, useLocation } from "react-router";

//imports
import MainSection from "./layouts/MainSection";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import HomeContext from "./contexts/HomeContext";
import { useAuth } from "./contexts/AuthContext";
import "@styles/App.scss";
import { ProjectsProvider } from "./contexts/ProjectsContext";

function App() {
  const { isAuthenticated } = useAuth();

  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <HomeContext.Provider value={isHome}>
      <ProjectsProvider>
        <div className="container">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* homepage: feature & dashboard */}
              <Route
                index
                element={
                  <MainSection
                    homepage={isAuthenticated ? "dashboard" : "feature"}
                  />
                }
              />
              {/* authentication page: login & register */}
              <Route path="/auth" element={<MainSection authPage={true} />} />
              {/* route for project pages */}
              <Route
                element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
              >
                {/* show all projects in card */}
                <Route
                  path="/projects"
                  element={<MainSection projectsCardPage={true} />}
                />
                {/* show a specific project & fetch all data */}
                <Route
                  path="/projects/:projectId"
                  element={<MainSection projectPage={true} />}
                />
                {/* route to create a new project */}
                <Route
                  path="/projects/create"
                  element={<MainSection createProject={true} />}
                />
                {/* page to show all tasks */}
                <Route
                  path="/tasks"
                  element={<MainSection taskPage={true} />}
                />
                {/* page to show notifications */}
                <Route
                  path="/notifications"
                  element={<MainSection notificationPage={true} />}
                />
                {/* page to show conversations */}
                <Route
                  path="/conversations"
                  element={<MainSection conversationPage={true} />}
                />
              </Route>
            </Route>
          </Routes>
        </div>
      </ProjectsProvider>
    </HomeContext.Provider>
  );
}

export default App;
