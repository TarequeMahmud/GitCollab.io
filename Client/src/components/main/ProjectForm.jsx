import styles from "@styles/main/ProjectForm.module.scss";
const ProjectForm = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={styles.container}>
      <h1>Create A New Project</h1>
      <div className={styles["form-container"]}>
        <form action="" method="post">
          {/* title input section */}
          <div className={styles["input-container"]}>
            <label htmlFor="title" className={styles["input-title"]}>
              Project Title:
            </label>
            <input type="text" name="title" required />
          </div>

          {/* name input section */}

          <div className={`${styles["input-container"]} `}>
            <p className={styles["input-title"]}>Project Owner:</p>
            <div className={`${styles["name-container"]} `}>
              <div className={styles["label-input-holder"]}>
                <label htmlFor="full-name">Full Name:</label>
                <input type="text" name="full-name" required />
              </div>

              <div className={styles["label-input-holder"]}>
                <label htmlFor="username">Username:</label>
                <input type="text" required />
              </div>
            </div>
            {/* deadline */}
            <div className={`${styles["input-container"]} ${styles.deadline}`}>
              <p className={styles["input-title"]}>Deadline:</p>
              <div className={`${styles["name-container"]} `}>
                <select name="day" id="day">
                  <option value="0">Day</option>
                  {[...Array(31).keys()].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <select name="month" id="month">
                  <option value="0">Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select name="years" id="years">
                  <option value="0">Year</option>
                  {[...Array(10).keys()].map((_, index) => (
                    <option key={index + 2025} value={index + 2025}>
                      {index + 2025}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* description section */}

          <div
            className={`${styles["input-container"]} ${styles["project-description"]}`}
          >
            <label htmlFor="description" className={styles["input-title"]}>
              Description:
            </label>
            <textarea
              name="description"
              id="description"
              cols="25"
              rows="10"
            ></textarea>
          </div>
          <button type="submit">CREATE</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
