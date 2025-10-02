"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import UserTable from "@/components/UserTable";
import TaskCard from "@/components/TaskCard";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import Image from "next/image";
import Container from "@/components/Container";
import editIcon from "@/assets/icons/edit-text.png";
import addIcon from "@/assets/icons/add.png";

export default function Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [people, setPeople] = useState<Contributor[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<Contributor | null>(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("manager");

  // --- Load project either from context or backend ---
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const [userRes, projectRes, taskRes] = await Promise.all([
          fetchWithAuth("/accounts/me"),
          fetchWithAuth(`/projects/${projectId}`),
          fetchWithAuth(`/projects/${projectId}/get-tasks`),
        ]);

        if (!projectRes.ok) {
          router.replace("/");
          return;
        }

        const userData = userRes.ok ? await userRes.json() : null;
        const projectData = await projectRes.json();
        const taskData = taskRes.ok ? await taskRes.json() : [];

        if (!projectData) {
          router.replace("/");
          return;
        }

        setCurrentUser(projectData.contributors?.find((u: Contributor) => u.user === userData.id));
        setProject(projectData);
        setPeople(projectData.contributors || []);
        setTasks(taskData);
      } catch (err) {
        console.error("Error fetching project:", err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, fetchWithAuth, router]);

  // --- Add user to project ---
  const handleAddUser = async () => {
    if (!username.trim()) return;

    try {
      const response = await fetchWithAuth(`/projects/${projectId}/add-contributor/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
      });

      if (!response.ok) {
        if (response.status === 404)
          showAlert("Not Found", "User not found.");
        else if (response.status === 409)
          showAlert("Already Exists", "User already exists in project.");
        else showAlert("Error", "Failed to add user.");
        return;
      }

      if (response.status === 200) {
        const contributors = await response.json();
        setPeople(contributors);
        showAlert("Success", "User added to project.");
      }
    } catch (err) {
      console.error("Add user failed:", err);
      showAlert("Error", "Server error.");
    } finally {
      setShowUserForm(false);
      setUsername("");
      setRole("manager");
    }
  };

  if (loading) return <Spinner />;
  if (!project) return <h1>Project not found</h1>;

  return (
    <Container title={project.title} content>
      <div className="w-4/5 mx-auto p-10 mb-6 rounded-lg text-black">
        {/* Project Description */}
        <div className="bg-white rounded-md px-5 py-3 my-2.5">
          <p className="text-start">{project.description}</p>
          {currentUser?.role === "admin" && (
            <button className="flex items-center gap-2 bg-[#04c977] px-3 py-1 mt-3 rounded-sm">
              <Image src={editIcon} alt="edit icon" width={20} height={20} />
              <p className="font-bold">Edit</p>
            </button>
          )}
        </div>

        {/* Collaborators */}
        <div className="bg-white rounded-md p-8 pt-4 mb-6">
          <h3 className="font-bold text-xl mb-6">Collaborators</h3>
          <UserTable
            currentUser={currentUser}
            projectUserData={people}
            taskState={{ tasks, setTasks }}
            peopleState={setPeople}
          />

          {currentUser?.role === "admin" && (
            <div className="flex flex-col mt-4">
              {!showUserForm ? (
                <button
                  className="flex items-center gap-2 bg-[#04c977] px-3 py-1 rounded-md w-40"
                  onClick={() => setShowUserForm(true)}
                >
                  <Image src={addIcon} alt="add user" width={20} height={20} />
                  <p>Add Users</p>
                </button>
              ) : (
                <div className="flex gap-2 items-center mt-2">
                  <input
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-2 py-1 rounded-md border border-gray-300"
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-2 py-1 rounded-md border border-gray-300"
                  >
                    <option value="manager">Manager</option>
                    <option value="member">Member</option>
                  </select>
                  <button
                    onClick={handleAddUser}
                    className="bg-[#04c977] px-3 py-1 rounded-sm"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-md p-4">
          <h3 className="font-bold text-xl mb-2">Tasks Assigned</h3>
          {tasks.length > 0 ? <TaskCard tasks={tasks} currentUser={currentUser} /> : <p className="text-center my-10">No tasks assigned yet.</p>}
        </div>
      </div>
    </Container>
  );
}
