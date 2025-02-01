import { MdAssignmentAdd, MdInfo, MdRemoveCircle } from "react-icons/md";

const UserTable = ({ projectUserData, className }) => {
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
                <MdInfo />
                <MdAssignmentAdd />
                <MdRemoveCircle />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
