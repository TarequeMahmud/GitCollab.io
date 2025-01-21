import styles from "@styles/main/ProjectSection.module.scss";
import { MdOutlineCreate } from "react-icons/md";
import datas from "@datas/bulkProjects.json";
import { useNavigate } from "react-router";

const ProjectSection = () => {
  const navigate = useNavigate();
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
            <hr className={styles["card-separator"]} />
            <div className={styles["features-container"]}>\</div>
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
