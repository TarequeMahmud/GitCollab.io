const TaskCard = ({ tasks, styles }) => {
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
              <strong>Due Date:</strong> {task.deadline}
            </p>
          </div>

          <hr />
          <button>show task</button>
        </div>
      ))}
    </div>
  );
};
export default TaskCard;
