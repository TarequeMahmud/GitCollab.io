import { MdAssignmentAdd, MdInfo, MdRemoveCircle } from "react-icons/md";
import TaskForm from "./TaskForm";
import { useState } from "react";
import authFetch from "@services/fetch.js";
import { useParams } from "react-router";
const UserTable = ({ projectUserData, className, taskState, peopleState }) => {
  const { projectId } = useParams();
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
  const handleRemovePerson = async (userId) => {
    try {
      const deleteResponse = await authFetch(
        `/project/${projectId}/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!deleteResponse) {
        showAlert(
          "Error",
          "We are unable to make a request to delete this person. Check your connection!"
        );
        return;
      }

      if (deleteResponse.status === 404) {
        showAlert("User Not Found", "This user seems to be wrong place.");
        return;
      }
      if (deleteResponse.status === 500) {
        showAlert("Server Error", "There was an error in the server");
        return;
      }
      peopleState(deleteResponse.data);
      return;
    } catch (error) {
      console.log("error deleting the user", error);
      return;
    }
  };
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
