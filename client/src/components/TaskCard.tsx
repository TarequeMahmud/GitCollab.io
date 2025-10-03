"use client";

import { useParams, useRouter } from "next/navigation";
import formatDate from "@/utils/formatDate";

interface TaskCardProps {
  tasks: Task[];
  currentContributor: Contributor | null;
}

export default function TaskCard({ tasks, currentContributor }: TaskCardProps) {
  const { projectId } = useParams();
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-10 justify-items-center my-5">
      {tasks.map((task, index) => (
        <div
          key={index}
          className="bg-blue-400 border border-blue-600 rounded-md p-3 w-72 min-h-[250px] shadow-md flex flex-col justify-between items-center"
        >
          <h2 className="text-xl font-bold mb-2">{task.title}</h2>
          <hr className="w-4/5 my-2 border-[#727272]" />
          <div className="w-4/5 flex flex-col items-start gap-1">
            <p>
              <strong>Assignee:</strong> {task.assignee_details.name}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Due Date:</strong> {formatDate(task.deadline)}
            </p>
          </div>
          <hr className="w-4/5 my-2 border-[#727272]" />
          {(currentContributor!.role === "admin" ||
            currentContributor!.user === task.assignee_details.user) && (
              <button
                onClick={() =>
                  router.push(
                    `/projects/${projectId}/tasks/${task.id}`
                  )
                }
                className="mt-3 bg-white px-2 py-1 rounded-md text-black font-bold"
              >
                Show Task
              </button>
            )}
        </div>
      ))}
    </div>
  );
}
