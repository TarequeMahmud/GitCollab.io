"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import UserTable from "@/components/UserTable";
import TaskCard from "@/components/TaskCard";
import authFetch from "@/services/fetch";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import editIcon from "@/assets/icons/edit-text.png";
import addIcon from "@/assets/icons/add.png";
import Image from "next/image";
import Container from "@/components/Container";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [people, setPeople] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("manager");

  //-- Fetch project & tasks
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const [projectResponse, taskResponse] = await Promise.all([
          authFetch(`/project/${projectId}`, { method: "GET" }),
          authFetch(`/project/${projectId}/task`, { method: "GET" }),
        ]);

        if (!projectResponse?.data) {
          router.push("/");
          return;
        }

        setProject(projectResponse.data);
        setPeople(projectResponse.data.people);
        setCurrentUser(projectResponse.data.current_user);

        if (taskResponse?.status === 200 && taskResponse.data.length !== 0) {
          setTasks(taskResponse.data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching project: ", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  //-- Add user to project
  const handleAddUser = async () => {
    if (!username) return;

    try {
      const response = await authFetch(
        `/project/${projectId}/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, role }),
        },
        setIsAuthenticated
      );

      if (!response) {
        showAlert("Error", "Server seems not to be working.");
        return;
      }
      if (response.status === 404) {
        showAlert("Not Found", "User not found.");
        return;
      }
      if (response.status === 409) {
        showAlert("Already Exists", "User already exists in project.");
        return;
      }

      setPeople(response.data.people);
    } catch (error) {
      console.error(error);
    } finally {
      setShowUserForm(false);
      setUsername("");
      setRole("manager");
    }
  };

  if (loading) return <Spinner />;
  if (!project) return <h1>Project not found</h1>;

  return (
    <Container
      title={project ? project.title : "Project Details"}
      content={true}
    >
      <div className="w-4/5 mx-auto p-10 mb-6 rounded-lg text-black">
        <div className="bg-white rounded-md px-5 py-3 my-2.5 mx-auto">
          <p className="text-start">{project.description}</p>
          {currentUser?.role === "admin" && (
            <button className="flex items-center gap-2 bg-[#04c977]  px-3 py-1 mt-3 rounded-sm">
              <Image src={editIcon} alt="edit icon" width={20} height={20} />
              <p className="font-bold">Edit</p>
            </button>
          )}
        </div>

        {/* Collaborators Table */}
        <div className="bg-white rounded-md p-8 pt-4 mb-6">
          <h3 className="font-bold text-xl mb-6">Collaborators Table</h3>
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
                    <option value="Manager">Manager</option>
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

        {/* Tasks Section */}
        <div className="bg-white rounded-md p-4">
          <h3 className="font-bold text-xl mb-2">Total Tasks Assigned</h3>
          <TaskCard tasks={tasks} currentUser={currentUser} />
        </div>
      </div>
    </Container>
  );
}
