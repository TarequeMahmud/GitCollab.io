import styles from "@styles/main/ProjectSection.module.scss";
import datas from "@datas/bulkProjects.json";
const ProjectSection = () => {
  return (
    <>
      <h1>My Projects</h1>
      <div className={styles.container}>
        {datas.map((data, index) => (
          <div key={index} className={styles["project-card"]}>
            <h4>{data.name}</h4>

            <p className={styles.description}>
              {data.description.length > 50
                ? `${data.description.slice(0, 50)}...`
                : data.description}
            </p>
            <hr />
            <div className={styles["features-container"]}></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectSection;
