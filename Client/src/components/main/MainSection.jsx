import styles from "@styles/main/MainSection.module.scss";
import FeatureSection from "./FeatureSection.jsx";
import SigninSection from "./SigninSection.jsx";
import ProjectSection from "./ProjectSection.jsx";
import ProjectForm from "./ProjectForm.jsx";
import ProjectPage from "./ProjectPage.jsx";
import Spinner from "./Spinner.jsx";

const MainSection = ({
  spin = false,
  features = false,
  authSection = false,
  projectSection = false,
  createProject = false,
  showSingleProject = false,
}) => {
  return (
    <div className={`${styles.container} ${projectSection && styles.project}`}>
      {authSection && <SigninSection />}
      {features && <FeatureSection />}
      {spin && <Spinner />}
      {projectSection && <ProjectSection />}
      {showSingleProject && <ProjectPage />}
      {createProject && <ProjectForm />}
    </div>
  );
};

export default MainSection;
