import styles from "@styles/main/ProjectSection.module.scss";
import { MdOutlineCreate } from "react-icons/md";
import datas from "@datas/bulkProjects.json";
import { useNavigate } from "react-router";
import generateFeatures from "@utils/generateFeatures.js";
import CardFeatures from "./CardFeatures";

const ProjectSection = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.heading}>
        <h1>MY PROJECTS</h1>
      </div>
      <div className={styles.container}>
        {datas.map((data, index) => (
          <div key={index} className={styles["project-card"]}>
            <h2>{data.name}</h2>

            <p className={styles.description}>
              {data.description.length > 100
                ? `${data.description.slice(0, 100)}...`
                : data.description}
            </p>
            <hr className={styles["card-separator"]} />
            <div className={styles["features-container"]}>
              {generateFeatures(data).map((feature, index) => (
                <CardFeatures
                  key={index}
                  icon={feature.icon}
                  info={feature.info}
                  styles={{
                    holder: styles["feature-holder"],
                    title: styles["feature-title"],
                    icon: styles["feature-icon"],
                  }}
                />
              ))}
            </div>
            <hr className={styles["card-separator"]} />
            <button className={styles["card-button"]}>See Project</button>
          </div>
        ))}
      </div>
      <div
        class={styles["add-button"]}
        onClick={() => {
          navigate("/create");
        }}
      >
        <MdOutlineCreate width={10} height={10} />
      </div>
    </>
  );
};

export default ProjectSection;
