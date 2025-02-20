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

const TaskPage = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const alertOnError = useError();
  //necessary states
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState("");

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

  //--handle-click functions Here--
  // const handleAddUser = async () => {
  //   if (!username) {
  //     return;
  //   }
  //   try {
  //     const response = await authFetch(
  //       `/project/${projectId}/users`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ username: username, role: role }),
  //       },
  //       setIsAuthenticated
  //     );

  //     if (!response) {
  //       showAlert(
  //         "Error",
  //         "Something error occured to make request. Server seems not to be working."
  //       );
  //       return null;
  //     }

  //     if (response.status === 404) {
  //       showAlert(
  //         "Not Found",
  //         "User not found. Please try to give a correct username."
  //       );
  //       return null;
  //     }
  //     if (response.status === 409) {
  //       showAlert("Already Exists", "This user already exists in the project.");
  //       return null;
  //     }
  //     setPeople(response.data.people);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   //after adding to user table reset the form
  //   setShowUserForm(false);
  //   setUsername("");
  //   setRole("manager");
  // };

  //conditional rendering
  if (loading) return <Spinner />;

  return (
    <div className={styles.container}>
      <>
        {/* 1. title and description container */}
        <h1 className={styles.heading}>{task.title}</h1>
        <div className={styles.assignee}>
          <h2>Assigned To: </h2>
          <p>
            {task.assigned_to.name} <em>(@{task.assigned_to.username})</em>
          </p>
        </div>
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
          <button
            className={`${styles.button} ${styles["button-edit"]}`}
            type="button"
          >
            <img src={editIcon} alt="edit icon" height={20} width={20} />
            <p>Edit</p>
          </button>
        </div>
        <h1>Submission Section</h1>
        <div className={`${styles.section} ${styles.submission}`}>
          <h2>Assignee has not submitted yet</h2>
        </div>
        <h2>Personal messages from the collaborator</h2>
        <div className={`${styles.section} ${styles.submission}`}>
          <h2>No message received</h2>
        </div>
      </>
    </div>
  );
};

export default TaskPage;
