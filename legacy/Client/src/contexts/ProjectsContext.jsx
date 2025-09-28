import { createContext, useContext, useState } from "react";
export const ProjectsContext = createContext();
export const useProjects = () => useContext(ProjectsContext);
export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};
