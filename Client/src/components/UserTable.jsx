import { MdAssignmentAdd, MdInfo, MdRemoveCircle } from "react-icons/md";
import TaskForm from "./TaskForm";
import { useState } from "react";

const UserTable = ({ projectUserData, className, taskState }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [userId, setUserId] = useState("");
  //handle click functions

  const handleShowInfo = (userId) => {
    console.log(userId);
  };
  const handleAssignTask = (userId) => {
    setShowTaskForm(true);
    setUserId(userId);
  };
  const handleRemovePerson = (userId) => {};
  return (
    <>
      {" "}
      <table
        border="1"
        className={className.table}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Person</th>
            <th>Role</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {projectUserData.map((userData, index) => (
            <tr
              key={index}
              // style={{ backgroundColor: "rgba(17, 190, 233, 0.2)" }}
            >
              <td>{userData.name}</td>
              <td>{userData.role}</td>
              <td>
                <div className={className.operationColumn}>
                  {userData.role !== "admin" && (
                    <MdInfo
                      title="See More info"
                      onClick={() => handleShowInfo(userData.user_id)}
                      style={{ fill: "#0e91e9" }}
                    />
                  )}

                  <MdAssignmentAdd
                    title="Assign a task to him."
                    onClick={() => handleAssignTask(userData.user_id)}
                    style={{ fill: "#08b86f" }}
                  />

                  {userData.role !== "admin" && (
                    <MdRemoveCircle
                      title="Remove from the project."
                      onClick={() => handleRemovePerson(userData.user_id)}
                      style={{ fill: "#e41010" }}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showTaskForm && (
        <TaskForm
          isShown={setShowTaskForm}
          userId={userId}
          taskState={taskState}
        />
      )}
    </>
  );
};

export default UserTable;
