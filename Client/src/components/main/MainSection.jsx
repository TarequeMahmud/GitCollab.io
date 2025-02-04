import styles from "@styles/main/MainSection.module.scss";
import FeatureSection from "./FeatureSection.jsx";
import SigninSection from "./SigninSection.jsx";
import ProjectSection from "./ProjectSection.jsx";
import ProjectForm from "./ProjectForm.jsx";
import ProjectPage from "./ProjectPage.jsx";

const MainSection = ({
  features = false,
  signin = false,
  project = false,
  createProject = false,
  showSingleProject = false,
}) => {
  const isNotLoggedin =
    JSON.parse(localStorage.getItem("notLoggedIn")) || false;
  return (
    <div className={`${styles.container} ${project && styles.project}`}>
      {features && signin && (
        <>
          <FeatureSection />
          <hr />
          {isNotLoggedin && <SigninSection />}
        </>
      )}
      {project && <ProjectSection />}
      {showSingleProject && <ProjectPage />}
      {createProject && <ProjectForm />}
    </div>
  );
};

export default MainSection;
