import "./styles/App.scss";
import MainSection from "./components/main/MainSection";
import { Routes, Route, useLocation } from "react-router";
import Layout from "./components/Layout";
import HomeContext from "@contexts/HomeContext";
function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
      <HomeContext.Provider value={isHome}>
        <div className="container">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={<MainSection features={true} signin={true} />}
              />

              <Route
                path="/projects"
                element={<MainSection project={true} />}
              />
            </Route>
          </Routes>
        </div>
      </HomeContext.Provider>
    </>
  );
}

export default App;
