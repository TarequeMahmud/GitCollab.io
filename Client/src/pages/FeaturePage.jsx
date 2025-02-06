import { useNavigate } from "react-router";
import styles from "./FeaturePage.module.scss";
import features from "@datas/features.js";

const FeatureSection = () => {
  const navigate = useNavigate();
  //handle function
  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Features of This App</h1>
      {features.map((feature, index) => {
        return (
          <div key={index} className={styles["feature-container"]}>
            <div className={styles["img-div"]}>
              <img src={feature.icon} alt={feature.title} />
            </div>
            <div className={styles["desc-container"]}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        );
      })}
      <button onClick={handleAuthRedirect}>
        <p>Start Your Project</p>
      </button>
    </div>
  );
};

export default FeatureSection;
