import styles from "@styles/main/ProjectPage.module.scss";
import editIcon from "@icons/edit-text.png";
import addIcon from "@icons/add.png";
import UserTable from "./UserTable";
import TaskList from "./TaskCard";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const ProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  //--retrieve the user id that passed from the project section--
  const userId =
    location.state?.userId ||
    (storedUserId
      ? JSON.parse(sessionStorage.getItem(`project-${projectId}`)).userId
      : null);

  //--make api request to retrieve project data from database.--
  useEffect(() => {
    if (!projectId && !userId) return;
    const fetchProject = async () => {
      try {
        const [projectResponse, taskResponse] = await Promise.all([
          fetch(`http://localhost:5000/project/${projectId}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`http://localhost:5000/project/${projectId}/task`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const projectData = await projectResponse.json();
        if (taskResponse.ok) {
          const taskData = await taskResponse.json();
          setTasks(taskData);
        }

        console.log(projectData);
        console.log(taskResponse);

        setProject(projectData);
        setPeople(projectData.people);
      } catch (error) {
        console.error("there was an error: ", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, userId]);

  //--handle-click functions Here--
  const handleAddUser = async () => {
    if (!username) {
      console.log("please enter the name");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/project/${projectId}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, role: role }),
          credentials: "include",
        }
      );
      const userData = await response.json();
      setPeople(userData.people);
    } catch (error) {
      console.log(error);
    }
    console.log(username, role);
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
        <h1>{project.name}</h1>
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
        <div className={styles["user-table-container"]}>
          <h3>Total Users Working in this project</h3>
          <UserTable
            projectUserData={people}
            className={{
              operationColumn: styles["operation-column"],
              table: styles.table,
            }}
          />
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
        <div className={styles["user-table-container"]}>
          <h3>Total tasks assigned</h3>
          <TaskList tasks={tasks} />
        </div>
      </>
    </div>
  );
};

export default ProjectPage;
