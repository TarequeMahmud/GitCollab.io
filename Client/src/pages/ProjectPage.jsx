import styles from "./ProjectPage.module.scss";
import editIcon from "@icons/edit-text.png";
import addIcon from "@icons/add.png";
import UserTable from "@comp/UserTable";
import TaskCard from "@comp/TaskCard";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Spinner from "@comp/Spinner";
import authFetch from "@services/fetch.js";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";

const ProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  //necessary states
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({});
  const [people, setPeople] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("manager");
  //project id
  const { projectId } = useParams();

  //--make api request to retrieve project data from database.--
  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      try {
        const [projectResponse, taskResponse] = await Promise.all([
          authFetch(`/project/${projectId}`, {
            method: "GET",
          }),
          authFetch(`/project/${projectId}/task`, {
            method: "GET",
          }),
        ]);
        console.log(projectResponse);
        console.log(taskResponse);

        if (taskResponse.status !== 200) {
          setTasks([]);
        }

        if (taskResponse.status === 200 && taskResponse.data.length !== 0) {
          setTasks(taskResponse.data);
        }
        setProject(projectResponse.data);
        setPeople(projectResponse.data.people);
      } catch (error) {
        console.error("there was an error: ", error);
        navigate("/");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  //--handle-click functions Here--
  const handleAddUser = async () => {
    if (!username) {
      return;
    }
    try {
      const response = await authFetch(
        `/project/${projectId}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, role: role }),
        },
        setIsAuthenticated
      );

      if (!response) {
        showAlert(
          "Error",
          "Something error occured to make request. Server seems not to be working."
        );
        return null;
      }

      if (response.status === 404) {
        showAlert(
          "Not Found",
          "User not found. Please try to give a correct username."
        );
        return null;
      }
      if (response.status === 409) {
        showAlert("Already Exists", "This user already exists in the project.");
        return null;
      }
      setPeople(response.data.people);
    } catch (error) {
      console.log(error);
    }
    //after adding to user table reset the form
    setShowUserForm(false);
    setUsername("");
    setRole("manager");
  };

  //conditional rendering
  if (loading) return <Spinner />;
  if (!project) return <h1>Project not found</h1>;

  return (
    <div className={styles.container}>
      <>
        {/* 1. title and description container */}
        <h1>{project.title}</h1>
        <div className={styles["description-container"]}>
          <p>{project.description}</p>
          <button
            className={`${styles.button} ${styles["button-edit"]}`}
            type="button"
          >
            <img src={editIcon} alt="edit icon" height={20} width={20} />
            <p>Edit</p>
          </button>
        </div>
        {/* 2. user table */}
        <div className={styles.section}>
          <h3>Collaborators Table</h3>
          <UserTable
            projectUserData={people}
            taskState={{ tasks, setTasks }}
            peopleState={setPeople}
            className={{
              operationColumn: styles["operation-column"],
              table: styles.table,
            }}
          />
          {/* add people to the user table */}
          <div className={styles["input-section"]}>
            {!showUserForm ? (
              <button
                className={`${styles.button} ${styles["button-add"]}`}
                onClick={() => setShowUserForm(true)}
                type="button"
              >
                <img src={addIcon} alt="add user icon" height={20} width={20} />
                <p>Add Users</p>
              </button>
            ) : (
              <div className={styles["input-container"]}>
                <input
                  placeholder="Enter Username"
                  name="add-user"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <select
                  name="role"
                  id="role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Manager">Manager</option>
                  <option value="member">Member</option>
                </select>
                <button
                  type="button"
                  name="submit"
                  className={`${styles.button} ${styles["button-submit"]}`}
                  onClick={handleAddUser}
                >
                  <p>Submit</p>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 3. task container */}
        <div className={styles.section}>
          <h3>Total tasks assigned</h3>
          <TaskCard
            tasks={tasks}
            styles={{
              card_container: styles["card-container"],
              card: styles["task-card"],
              features: styles["task-features"],
            }}
          />
        </div>
      </>
    </div>
  );
};

export default ProjectPage;
