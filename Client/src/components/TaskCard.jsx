const TaskCard = ({ task }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        width: "250px",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>{task.name}</h3>
      <p>
        <strong>Assignee:</strong> {task.assignee}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority}
      </p>
      <p>
        <strong>Due Date:</strong> {task.dueDate}
      </p>
    </div>
  );
};
const TaskList = ({ tasks }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "30px",
      }}
    >
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
};
export default TaskList;
