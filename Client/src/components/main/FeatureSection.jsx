import styles from "@styles/main/FeatureSection.module.scss";
import features from "@datas/features.js";

const FeatureSection = () => {
  return (
    <div className={styles.container}>
      {features.map((feature) => {
        return (
          <div className={styles["feature-container"]}>
            <div className={styles["img-div"]}>
              <img
                src={feature.icon}
                width={100}
                height={100}
                alt={feature.title}
              />
            </div>
            <div className={styles["desc-div"]}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureSection;
