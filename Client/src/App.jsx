import "./styles/App.scss";
import MainSection from "./components/main/MainSection";
import { Routes, Route } from "react-router";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={<MainSection features={true} signin={true} />}
            />
            <Route path="/projects" element={<MainSection project={true} />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
