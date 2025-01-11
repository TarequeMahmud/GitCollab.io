import styles from "@styles/main/MainSection.module.scss";
import FeatureSection from "./FeatureSection.jsx";
import SigninSection from "./SigninSection.jsx";
import ProjectSection from "./ProjectSection.jsx";
const MainSection = ({ features = false, signin = false, project = false }) => {
  return (
    <div className={`${styles.container} ${project && styles.project}`}>
      {features && signin && (
        <>
          <FeatureSection />
          <hr />
          <SigninSection />
        </>
      )}
      {project && <ProjectSection />}
    </div>
  );
};

export default MainSection;
