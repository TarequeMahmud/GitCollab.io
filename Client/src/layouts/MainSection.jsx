import styles from "./MainSection.module.scss";
import FeaturePage from "@pages/FeaturePage";
import SigninPage from "@pages/SigninPage";
import ProjectCardsPage from "@pages/ProjectCardsPage";
import ProjectFormPage from "@pages/ProjectFormPage";
import ProjectPage from "@pages/ProjectPage";
import Spinner from "@comp/Spinner";

const MainSection = ({
  spin = false,
  features = false,
  authSection = false,
  projectsCardPage = false,
  createProject = false,
  showSingleProject = false,
}) => {
  return (
    <div
      className={`${styles.container} ${projectsCardPage && styles.project}`}
    >
      {authSection && <SigninPage />}
      {features && <FeaturePage />}
      {spin && <Spinner />}
      {projectsCardPage && <ProjectCardsPage />}
      {showSingleProject && <ProjectPage />}
      {createProject && <ProjectFormPage />}
    </div>
  );
};

export default MainSection;
