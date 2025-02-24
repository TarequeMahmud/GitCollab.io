import styles from "./TaskPage.module.scss";
import editIcon from "@icons/edit-text.png";
import addIcon from "@icons/add.png";
import formatDate from "@utils/formatDate";
import images from "@icons/task/icons";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Spinner from "@comp/Spinner";
import authFetch from "@services/fetch.js";
import { useError } from "@contexts/ErrorContex";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";

const TaskPage = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const alertOnError = useError();
  const { showAlert } = useAlert();
  //necessary states
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState("");
  const { setIsAuthenticated } = useAuth();

  //--make api request to retrieve project data from database.--
  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async () => {
      try {
        const taskResponse = await authFetch(
          `/project/${projectId}/task/${taskId}`,
          {
            method: "GET",
          }
        );

        console.log(taskResponse);
        if (!taskResponse) {
          alertOnError("Server Error", { status: 500 });
        }

        if (!taskResponse.ok) {
          alertOnError("Error Retrieving Task", taskResponse);
        }
        setTask(taskResponse.data);
        setCurrentUser(taskResponse.data.current_user);
      } catch (error) {
        console.error("there was an error: ", error);
        navigate("/");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const { text, file } = Object.fromEntries(formData.entries());
    const maxSize = 2 * 1024 * 1024;
    if (file && file.size > maxSize) {
      alertOnError(
        "Big file size",
        "File size exceeds 2MB. Please upload a smaller file."
      );
      return;
    }

    try {
      setLoading(true);

      const submitTaskResponse = await authFetch(
        `/assignee/task/submit/${taskId}`,
        {
          method: "POST",
          body: formData,
        },
        setIsAuthenticated
      );
      console.log(submitTaskResponse);

      if (!submitTaskResponse) {
        alertOnError("Submission Failed", { status: 500 });
        return;
      }
      if (!submitTaskResponse.ok) {
        alertOnError("Submission Failed", submitTaskResponse);
        return;
      }

      showAlert("Submission Success", submitTaskResponse.data.message);
      return;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  //conditional rendering
  if (loading) return <Spinner />;

  return (
    <div className={styles.container}>
      <>
        {/* 1. title and description container */}
        <h1 className={styles.heading}>{task.title}</h1>
        {currentUser.role === "admin" && (
          <div className={styles.assignee}>
            <h2>Assigned To: </h2>
            <p>
              {task.assigned_to.name} <em>(@{task.assigned_to.username})</em>
            </p>
          </div>
        )}
        <div className={`${styles.section} ${styles.info}`}>
          <div>
            <img src={images.status} alt="status" />
            <p>
              <b>Status: </b>
              {task.status}
            </p>
          </div>
          <div>
            <img src={images.priority} alt="priority" />
            <p>
              <b>Priority: </b>
              {task.priority}
            </p>
          </div>
          <div>
            <img src={images.deadline} alt="deadline" />
            <p>
              <b>Deadline: </b>
              {formatDate(task.deadline)}
            </p>
          </div>
        </div>
        <div className={styles.section}>
          <p>{task.description}</p>
          {currentUser.role === "admin" && (
            <button
              className={`${styles.button} ${styles["button-edit"]}`}
              type="button"
            >
              <img src={editIcon} alt="edit icon" height={20} width={20} />
              <p>Edit</p>
            </button>
          )}
        </div>
        <h1>Submission Section</h1>
        <div className={`${styles.section} ${styles.submission}`}>
          {currentUser.role === "admin" && (
            <h2>Assignee has not submitted yet</h2>
          )}
          {currentUser._id === task.assigned_to._id && (
            <form
              className={styles["submission-form"]}
              onSubmit={handleSubmit}
              method="post"
              encType="multipart/form-data"
            >
              <div className={styles["input-container"]}>
                <label htmlFor="text" className={styles["input-text"]}>
                  Text to submit:
                </label>
                <textarea
                  name="text"
                  className={styles.text}
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <div className={styles["input-container"]}>
                <label htmlFor="file" className={styles["input-text"]}>
                  File to submit:
                </label>
                <input type="file" name="file" required />
              </div>
              <button type="submit">Submit the task</button>
            </form>
          )}
        </div>
        <h2>Personal messages from the collaborator</h2>
        <div className={`${styles.section} ${styles.submission}`}>
          <h2>No message received</h2>
        </div>
        <div className={`${styles.section} ${styles.action}`}>
          <button
            onClick={() => {
              return navigate(`/projects/${projectId}`);
            }}
          >
            Go to project
          </button>{" "}
          {currentUser._id === task.assigned_to._id && (
            <>
              {" "}
              <button
                onClick={() => {
                  return navigate(`/projects/${projectId}`);
                }}
              >
                Mark as in progress
              </button>
              <button
                onClick={() => {
                  return navigate(`/projects/${projectId}`);
                }}
              >
                Leave this task
              </button>
            </>
          )}
          {currentUser.role === "admin" && (
            <button
              onClick={() => {
                return navigate(`/projects/${projectId}`);
              }}
            >
              Delete The Task
            </button>
          )}
        </div>
      </>
    </div>
  );
};

export default TaskPage;
