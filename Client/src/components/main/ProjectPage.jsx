import styles from "@styles/main/ProjectPage.module.scss";
import datas from "@datas/bulkProjects.json";
import editIcon from "@icons/edit-text.png";
const sampleData = datas[0];
const ProjectPage = () => {
  return (
    <div className={styles.container}>
      <>
        <h1>{sampleData.name}</h1>
        <div className={styles["description-container"]}>
          <p>{sampleData.description}</p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
          <button className={styles["edit-button"]} type="button">
            <img src={editIcon} alt="edit icon" height={20} width={20} />
            <p>Edit</p>
          </button>
        </div>
      </>
    </div>
  );
};

export default ProjectPage;
