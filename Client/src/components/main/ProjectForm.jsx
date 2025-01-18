import styles from "@styles/main/ProjectForm.module.scss";
const ProjectForm = () => {
  return (
    <div className={styles.container}>
      <h1>Create A New Project</h1>
      <div className="form-container">
        <p>Fill up the necessary fields</p>
        <form action="" method="post">
          <label htmlFor="title">Project Title</label>
          <input type="text" name="title" />

          <div className="project-owner">
            <h3>Project Owner</h3>
            <label htmlFor="full-name">Full Name</label>
            <input type="text" name="full-name" />
            <label htmlFor="username">User Name</label>
            <input type="text" />
          </div>

          <label htmlFor="deadline">Deadline</label>
          <input type="date" name="" id="" />
          <div className="project-description">
            <label htmlFor="description"></label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
