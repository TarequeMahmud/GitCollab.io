import styles from "@styles/main/MainSection.module.scss";
import FeatureSection from "./FeatureSection.jsx";
import SigninSection from "./SigninSection.jsx";
const MainSection = () => {
  return (
    <div className={styles.container}>
      <FeatureSection />
      <hr />
      <SigninSection />
    </div>
  );
};

export default MainSection;
