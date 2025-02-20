import { useNavigate, useParams } from "react-router";
import formatDate from "@utils/formatDate";

const TaskCard = ({ tasks, styles }) => {
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
              <strong>Assignee:</strong> Abid Hassan
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
          <button
            onClick={() => navigate(`/projects/${projectId}/tasks/${task._id}`)}
          >
            Show Task
          </button>
        </div>
      ))}
    </div>
  );
};
export default TaskCard;
