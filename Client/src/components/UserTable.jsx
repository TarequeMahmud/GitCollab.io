import { MdAssignmentAdd, MdInfo, MdRemoveCircle } from "react-icons/md";

const UserTable = ({ projectUserData, className }) => {
  //handle click functions

  const handleShowInfo = (userId) => {
    console.log(userId);
  };
  const handleAssignTask = (userId) => {};
  const handleRemovePerson = (userId) => {};
  return (
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
          <tr key={index}>
            <td>{userData.name}</td>
            <td>{userData.role}</td>
            <td>
              <div className={className.operationColumn}>
                <MdInfo
                  title="See More info"
                  onClick={() => handleShowInfo(userData.user_id)}
                  style={{ fill: "#0e91e9" }}
                />
                <MdAssignmentAdd
                  title="Assign a task to him."
                  onClick={() => handleAssignTask(userData.user_id)}
                  style={{ fill: "#08b86f" }}
                />
                <MdRemoveCircle
                  title="Remove from the project."
                  onClick={() => handleRemovePerson(userData.user_id)}
                  style={{ fill: "#e41010" }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
