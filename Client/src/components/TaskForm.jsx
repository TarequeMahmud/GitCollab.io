import { useParams } from "react-router";
import { useAlert } from "../contexts/AlertContext";
import styles from "./TaskForm.module.scss";
import authFetch from "@services/fetch.js";
import { useAuth } from "@contexts/AuthContext";
import { useState } from "react";
import Spinner from "@comp/Spinner";
import { IoMdCloseCircle } from "react-icons/io";

const ProjectForm = ({ isShown, userId, taskState }) => {
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
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { projectId } = useParams();
  const { tasks, setTasks } = taskState;

  const handleClose = () => {
    isShown(false);
  };

  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { title, status, priority, day, month, year, description } =
      Object.fromEntries(formData.entries());

    const deadline = new Date(year, month - 1, day);
    const formObject = {
      title,
      status,
      priority,
      user_id: userId,
      deadline,
      description,
    };

    try {
      setLoading(true);

      const createTaskResponse = await authFetch(
        `/project/${projectId}/task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        },
        setIsAuthenticated
      );

      if (createTaskResponse.error) {
        if (createTaskResponse.status === 400) {
          showAlert("Missing Fields", "Please insert required fields");
        }
        if (createTaskResponse.status === 404) {
          showAlert("Project Not Found", "You are seems to be wrong place.");
        }
      }
      if (createTaskResponse.status === 201) {
        showAlert(
          "Creation Success",
          "Task assigned successfully. You will show the task card following the collaborators' table."
        );
        setTasks([...tasks, createTaskResponse.data.task]);
        isShown(false);
        return;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles["form-container"]}>
          <div className={styles.header}>
            <div></div>
            <h1>CREATE A NEW PROJECT</h1>
            <IoMdCloseCircle onClick={handleClose} className={styles.close} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* title input section */}
            <div className={styles["input-container"]}>
              <label htmlFor="title" className={styles["input-title"]}>
                Project Title:
              </label>
              <input type="text" name="title" required />
            </div>
            {/* status and priority section */}
            <div className={`${styles["status-priority-container"]} `}>
              <div className={`${styles["name-container"]} `}>
                <p className={styles["input-title"]}>Status:</p>
                <select name="status" required>
                  <option value="to-do">To-do</option>
                  <option value="in-progress">In-progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className={`${styles["name-container"]} `}>
                <p className={styles["input-title"]}>Priority:</p>
                <select name="priority" required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
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
      {loading && <Spinner />}
    </>
  );
};

export default ProjectForm;
