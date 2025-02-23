import { useEffect, useState } from "react";
import styles from "./TaskCardPage.module.scss";
import images from "@icons/task/icons";
import { useError } from "@contexts/ErrorContex";
import { useNavigate } from "react-router";
import Spinner from "@comp/Spinner";
import authFetch from "@services/fetch.js";
import formatDate from "@utils/formatDate.js";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const alertOnError = useError();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskResponse = await authFetch(
          "/assignee/tasks",
          {
            method: "get",
          },
          navigate
        );

        if (!taskResponse) {
          alertOnError("Coudn't Fetch Tasks", { status: 500 });
          return null;
        }
        if (taskResponse.status === 404) {
          return null;
        }

        if (!taskResponse.ok) {
          alertOnError("Task Fetch Problem", taskResponse);
          return null;
        }

        setTasks(taskResponse.data);
      } catch (error) {
        console.error("There was an error: ", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (tasks.length === 0) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, []);

  //handle The user to the task page
  const handleClick = (taskId, projectId) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
    return;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Assigned Tasks</h1>
      <hr className={styles.seperator} />

      {/* show all the tasks */}
      {tasks.length > 0 && (
        <div className={styles["card-container"]}>
          {tasks.map((task) => (
            <div
              onClick={() => {
                handleClick(task._id, task.project.project_id);
              }}
              className={styles.card}
              key={task._id}
            >
              <div className={styles["properties-holder"]}>
                <div className={styles.property}>
                  <img src={images.project} alt="project" />{" "}
                  <h3>{task.project.project_title}</h3>
                </div>
                <div className={styles.property}>
                  <img src={images.status} alt="status" />{" "}
                  <h3>
                    {task.status === "in-progress" && "Currently in progress"}
                    {task.status === "to-do" && "Not submitted yet"}
                    {task.status === "completed" && "Task Completed"}
                  </h3>
                </div>
                <div className={styles.property}>
                  <img src={images.priority2} alt="priority" />{" "}
                  <h3 className={styles[`${task.priority}`]}>
                    {task.priority === "high" && "Priotiry High"}
                    {task.priority === "medium" && "Priotiry Medium"}
                    {task.priority === "low" && "Priotiry Low"}
                  </h3>
                </div>
                <div className={styles.property}>
                  <img src={images.deadline} alt="deadline" />{" "}
                  <h3>Deadline {formatDate(task.deadline)}</h3>
                </div>
              </div>
              <div className={styles["title-desc-holder"]}>
                <div>
                  <h2>{task.title}</h2>
                  <p>
                    {task.description.length > 250
                      ? `${task.description.slice(0, 250)}...`
                      : task.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* loading */}
      {loading && <Spinner />}

      {/* if no tasks */}
      {tasks.length === 0 && (
        <h1 className={styles.empty}>
          No tasks have been assigned to you yet.
        </h1>
      )}
    </div>
  );
};

export default TaskPage;
