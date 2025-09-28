import { useNavigate, useParams } from "react-router";
import formatDate from "@utils/formatDate";

const TaskCard = ({ tasks, styles, currentUser }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  return (
    <div className={styles.card_container}>
      {tasks.map((task, index) => (
        <div className={styles.card} key={index}>
          <h2>{task.title}</h2>
          <hr />
          <div className={styles.features}>
            <p>
              <strong>Assignee: </strong>
              {task.assigned_to.name}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Due Date:</strong> {formatDate(task.deadline)}
            </p>
          </div>

          <hr />
          {(currentUser.role === "admin" ||
            currentUser._id === task.assigned_to._id) && (
            <button
              onClick={() =>
                navigate(`/projects/${projectId}/tasks/${task._id}`)
              }
            >
              Show Task
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
export default TaskCard;
