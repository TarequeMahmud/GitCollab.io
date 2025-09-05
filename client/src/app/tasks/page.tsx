"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import authFetch from "@/services/fetch";
import formatDate from "@/utils/formatDate";
import images from "@/assets/icons/task/icons";
import { useError } from "@/contexts/ErrorContex";
import Image, { StaticImageData } from "next/image";
import Container from "@/components/Container";

export default function Page() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const alertOnError = useError();
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskResponse = await authFetch("/assignee/tasks", {
          method: "GET",
        });
        if (!taskResponse) {
          alertOnError("Couldn't Fetch Tasks", { status: 500 });
          return;
        }
        if (taskResponse.status === 404) return;
        if (!taskResponse.ok) {
          alertOnError("Task Fetch Problem", taskResponse);
          return;
        }
        setTasks(taskResponse.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (tasks.length === 0) fetchTasks();
    else setLoading(false);
  }, []);

  const handleClick = (taskId: string, projectId: string) => {
    router.push(`/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <Container title="My Tasks" content={tasks.length !== 0}>
      {loading && <Spinner />}

      {tasks.length > 0 && (
        <div className="my-12 mx-auto w-11/12 flex flex-col items-center gap-8">
          {tasks.map((task) => (
            <div
              onClick={() => handleClick(task._id, task.project.project_id)}
              className="w-5/6 h-[250px] bg-gradient-to-r from-[#32ade6] to-[#1c6080] rounded-[35px] flex flex-row justify-between items-center cursor-pointer"
              key={task._id}
            >
              {/* Left side properties */}
              <div className="flex flex-col justify-center items-center h-full w-2/5 gap-1.5 p-2">
                <TaskProperty icon={images.project} alt="project">
                  {task.project.project_title}
                </TaskProperty>

                <TaskProperty icon={images.status} alt="status">
                  {task.status === "in-progress" && "Currently in progress"}
                  {task.status === "to-do" && "Not submitted yet"}
                  {task.status === "completed" && "Task Completed"}
                </TaskProperty>

                <TaskProperty
                  icon={images.priority2}
                  alt="priority"
                  textClass={
                    task.priority === "high"
                      ? "text-red-500"
                      : task.priority === "medium"
                      ? "text-lime-300"
                      : ""
                  }
                >
                  {task.priority === "high" && "Priority High"}
                  {task.priority === "medium" && "Priority Medium"}
                  {task.priority === "low" && "Priority Low"}
                </TaskProperty>

                <TaskProperty icon={images.deadline} alt="deadline">
                  Deadline {formatDate(task.deadline)}
                </TaskProperty>
              </div>

              {/* Right side title + description */}
              <div
                className="h-full w-3/5 rounded-r-[35px] flex flex-col justify-center items-center"
                style={{
                  clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  backgroundColor: "rgba(33,33,33,0.25)",
                  paddingRight: "20px",
                }}
              >
                <div className="flex flex-col justify-center items-center ml-[15%] h-[90%] w-4/5">
                  <h2 className="w-full text-white text-xl font-semibold mb-2">
                    {task.title}
                  </h2>
                  <p className="w-full text-justify text-sm font-normal text-white overflow-hidden">
                    {task.description.length > 250
                      ? `${task.description.slice(0, 250)}...`
                      : task.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

const TaskProperty = ({
  icon,
  alt,
  children,
  textClass = "",
}: {
  icon: StaticImageData;
  alt: string;
  children: React.ReactNode;
  textClass?: string;
}) => (
  <div className="flex flex-row justify-start items-center gap-2 w-4/5 h-[20%] rounded-[11px] bg-black/60 p-1">
    <Image src={icon} alt={alt} className="w-[30px] h-[30px] ml-2 mr-2.5" />
    <h3 className={`text-white self-center ${textClass}`}>{children}</h3>
  </div>
);
