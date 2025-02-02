import styles from "@styles/main/ProjectPage.module.scss";
import datas from "@datas/bulkProjects.json";
import editIcon from "@icons/edit-text.png";
import addIcon from "@icons/add.png";
import UserTable from "./UserTable";
import TaskList from "./TaskCard";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
const sampleData = datas[0];
const tasks = [
  {
    name: "Design Homepage",
    assignee: "Alice",
    status: "In Progress",
    priority: "High",
    dueDate: "Feb 5",
  },
  {
    name: "API Development",
    assignee: "Bob",
    status: "To Do",
    priority: "Medium",
    dueDate: "Feb 7",
  },
  {
    name: "Write Docs",
    assignee: "Charlie",
    status: "Completed",
    priority: "Low",
    dueDate: "Jan 30",
  },
  {
    name: "Write Docs",
    assignee: "Charlie",
    status: "Completed",
    priority: "Low",
    dueDate: "Jan 30",
  },
  {
    name: "Write Docs",
    assignee: "Charlie",
    status: "Completed",
    priority: "Low",
    dueDate: "Jan 30",
  },
];

const ProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //necessary states
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({});
  //project id
  const { projectId } = useParams();

  //retrieve the user id that passed from the project section
  const userId =
    location.state?.userId ||
    (storedUserId
      ? JSON.parse(sessionStorage.getItem(`project-${projectId}`)).userId
      : null);

  console.log(userId);
  //make api request to retrieve project data from database.
  useEffect(() => {
    if (!projectId && !userId) return;
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/${userId}/project/${projectId}`,
          {
            method: "get",
            credentials: "include",
          }
        );
        const projectData = await response.json();
        console.log(projectData);

        setProject(projectData);
      } catch (error) {
        console.error("there was an error: ", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, userId]);

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
            projectUserData={sampleData.people}
            className={{
              operationColumn: styles["operation-column"],
              table: styles.table,
            }}
          />
          <button
            className={`${styles.button} ${styles["button-add"]}`}
            type="button"
          >
            <img src={addIcon} alt="add user icon" height={20} width={20} />
            <p>Add Users</p>
          </button>
        </div>
        <div className={styles["user-table-container"]}>
          <h3>Total tasks assigned</h3>
          <TaskList tasks={tasks} />;
          <button
            className={`${styles.button} ${styles["button-add"]}`}
            type="button"
          >
            <img src={addIcon} alt="add user icon" height={20} width={20} />
            <p>Add Users</p>
          </button>
        </div>
      </>
    </div>
  );
};

export default ProjectPage;
