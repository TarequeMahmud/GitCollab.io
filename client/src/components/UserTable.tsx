"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MdAssignmentAdd, MdInfo, MdRemoveCircle } from "react-icons/md";
import TaskForm from "./TaskForm";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import UserdataModal from "./UserdataModal";

const thClass =
  "px-2 py-1 border-2 border-[rgb(2,69,133)] bg-[#2eeb1d7e] text-left";
const tdClass = "text-left px-2 py-1 border-2 border-[rgb(2,69,133)] bg-white";

interface UserTableProps {
  projectUserData: Contributor[];
  currentUser: Contributor | null;
  taskState: { tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>> };
  peopleState: (people: Contributor[]) => void;
}

export default function UserTable({
  projectUserData,
  currentUser,
  taskState,
  peopleState,
}: UserTableProps) {
  const { tasks } = taskState;
  const { projectId } = useParams();
  const { fetchWithAuth } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userdata, setUserdata] = useState<Contributor | null>(null);
  const { showAlert } = useAlert();

  const handleAssignTask = (userId: string) => {
    setShowTaskForm(true);
    setUserId(userId);
  };

  const handleRemovePerson = async (userId: string) => {
    try {
      const deleteResponse = await fetchWithAuth(`/projects/${projectId}/remove-contributor/${userId}/`, {
        method: "DELETE",
      }).then((res) => res.json());

      if (!deleteResponse) {
        showAlert("Error", "Failed to delete person.");
        return;
      }

      peopleState(deleteResponse);
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full mb-2.5 border-collapse text-xl overflow-hidden">
        <thead>
          <tr>
            <th className={thClass}>Person</th>
            <th className={thClass}>Role</th>
            {currentUser!.role === "admin" && (
              <th className={thClass}>Operation</th>
            )}
          </tr>
        </thead>

        <tbody>
          {projectUserData.map((userData, index) => (
            <tr key={index}>
              <td className={tdClass}>{userData.name}</td>
              <td className={tdClass}>{userData.role}</td>

              {currentUser!.role === "admin" && (
                <td className={tdClass}>
                  <div className="flex flex-row justify-around items-center gap-2">
                    {userData.role !== "admin" && (
                      <MdInfo
                        title="See More info"
                        onClick={() => setUserdata(userData)}
                        className="text-[#0e91e9] cursor-pointer"
                      />
                    )}
                    <MdAssignmentAdd
                      title="Assign a task to him."
                      onClick={() => handleAssignTask(userData.user)}
                      className="text-[#08b86f] cursor-pointer"
                    />
                    {userData.role !== "admin" && (
                      <MdRemoveCircle
                        title="Remove from the project."
                        onClick={() => handleRemovePerson(userData.user)}
                        className="text-[#e41010] cursor-pointer"
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showTaskForm && userId && (
        <TaskForm isShown={setShowTaskForm} setTasks={taskState.setTasks} userId={userId} />
      )}
      {userdata && (
        <UserdataModal userObject={{ userdata, setUserdata }} tasks={tasks} />
      )}
    </div>
  );
}
