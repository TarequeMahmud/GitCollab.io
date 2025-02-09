import { useNavigate } from "react-router";
import { useAlert } from "../contexts/AlertContext";
import styles from "./ProjectFormPage.module.scss";
import authFetch from "@services/fetch.js";
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
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { title, day, month, year, description } = Object.fromEntries(
      formData.entries()
    );
    const deadline = new Date(year, month - 1, day);
    const formObject = { title, deadline, description };

    try {
      const createProjectResponse = await authFetch("/project/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (createProjectResponse.error) {
        if (createProjectResponse.status === 200) {
          showAlert("Missing Fields", "Please insert required fields");
        }
      }
      if (createProjectResponse.status === 201) {
        showAlert(
          "Creation Success",
          "Your Project created successfully. You have been headed to the project page."
        );
        window.location.href = "/projects";
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className={styles.container}>
      <h1>CREATE A NEW PROJECT</h1>
      <div className={styles["form-container"]}>
        <form onSubmit={handleSubmit}>
          {/* title input section */}
          <div className={styles["input-container"]}>
            <label htmlFor="title" className={styles["input-title"]}>
              Project Title:
            </label>
            <input type="text" name="title" required />
          </div>

          {/* deadline */}
          <div className={`${styles["input-container"]} ${styles.deadline}`}>
            <p className={styles["input-title"]}>Deadline:</p>
            <div className={`${styles["name-container"]} `}>
              <select name="day" id="day" required>
                <option value="">Day</option>
                {[...Array(31).keys()].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <select name="month" id="month" required>
                <option value="">Month</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <select name="year" id="year" required>
                <option value="">Year</option>
                {[...Array(10).keys()].map((_, index) => (
                  <option key={index + 2025} value={index + 2025}>
                    {index + 2025}
                  </option>
                ))}
              </select>
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
