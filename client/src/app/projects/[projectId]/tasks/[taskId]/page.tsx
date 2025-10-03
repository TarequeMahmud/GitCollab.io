"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useError } from "@/contexts/ErrorContex";
import formatDate from "@/utils/formatDate";
import editIcon from "@/assets/icons/edit-text.png";
import images from "@/assets/icons/task/icons";
import Image from "next/image";
import Container from "@/components/Container";

export default function Page() {
  const router = useRouter();
  const { projectId, taskId } = useParams();
  const { showAlert } = useAlert();
  const { fetchWithAuth, currentUser } = useAuth();
  const alertOnError = useError();
  const [task, setTask] = useState<Task | null>(null);
  const [currentContributor, setCurrentContributor] = useState<AssigneeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  console.log(taskId);


  // fetch task
  useEffect(() => {
    if (!taskId || !currentUser) return;
    const fetchTask = async () => {
      try {
        const taskResponse = await fetchWithAuth(
          `/tasks/${taskId}`,
          {
            method: "GET",
          }
        );



        if (!taskResponse) return alertOnError("Server Error", { status: 500 });
        if (!taskResponse.ok)
          return alertOnError("Error Retrieving Task", taskResponse);

        const taskData = await taskResponse.json();
        setTask(taskData);
        console.log("Task Data: ", taskData);

        setCurrentContributor(taskData.project_details.contributors.find((contributor: Contributor) => contributor.user === currentUser.id) || null);
        setIsSubmitted(
          taskData.submission?.text ||
          taskData.submission?.file_name
        );
      } catch (error) {
        console.error("Fetch task error: ", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId, currentUser]);

  // submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { file } = Object.fromEntries(formData.entries()) as any;
    const maxSize = 5 * 1024 * 1024;

    if (file && file.size > maxSize) {
      alertOnError("Big file size", {
        message: "File size exceeds 5MB. Please upload a smaller file.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/assignee/task/submit/${taskId}`,
        {
          method: "POST",
          body: formData,
        },

      );

      if (!response) return alertOnError("Submission Failed", { status: 500 });
      if (!response.ok) return alertOnError("Submission Failed", response);

      showAlert("Submission Success", "Your task has been submitted.");
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.location.href = `http://localhost:5000/assignee/tasks/${taskId}/downloads/`;
  };

  if (loading || !task) return <Spinner />;

  return (
    <Container title={task.title}>
      <div className="w-4/5 flex flex-col justify-start items-center mx-auto">

        <div className="flex flex-row items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Assigned To:</h2>
          <p className="text-xl">
            {task.assignee_details.name} <em>(@{task.assignee_details.username})</em>
          </p>
        </div>


        {/* Task Info */}
        <div className="w-full flex justify-around bg-gray-100 p-4 rounded-md mb-4">
          <div className="flex items-center gap-2">
            <Image src={images.status} alt="status" className="w-10 h-10" />
            <p>
              <b>Status:</b> {task.status}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image src={images.priority} alt="priority" className="w-10 h-10" />
            <p>
              <b>Priority:</b> {task.priority}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image src={images.deadline} alt="deadline" className="w-10 h-10" />
            <p>
              <b>Deadline:</b> {formatDate(task.deadline)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="w-full bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-start">{task.description}</p>
          {currentContributor!.role === "admin" && (
            <button className="flex items-center gap-2 bg-[#04c977]  px-3 py-1 mt-3 rounded-sm">
              <Image src={editIcon} alt="edit" className="w-5 h-5" /> Edit
            </button>
          )}
        </div>

        {/* Submission Section */}
        <h2 className="text-xl font-bold mb-2">Submission Section</h2>
        <div className="w-full min-h-[200px] bg-gray-100 p-4 rounded-md mb-4">
          {!isSubmitted && currentContributor!.role === "admin" && (
            <h2>Assignee has not submitted yet</h2>
          )}

          {/* {currentContributor!.user === task.assignee_details.user && !isSubmitted && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="text" className="font-bold">
                  Text to submit:
                </label>
                <textarea
                  name="text"
                  defaultValue={task.submission!.text || ""}
                  className="border rounded-md p-2 h-32 resize-y"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="file" className="font-bold">
                  File to submit:
                </label>
                <input
                  type="file"
                  name="file"
                  required
                  className="border rounded-md p-1"
                />
                {task.submission?.file_name && (
                  <p className="mt-1">
                    <b>Current file:</b> <em>{task.submission.file_name}</em>
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-700 text-white p-2 rounded-md font-bold"
              >
                Submit the task
              </button>
            </form>
          )}

          {isSubmitted && (
            <div className="flex flex-col gap-2">
              <p>
                <b>Description:</b> <span>{task.submission.text}</span>
              </p>
              <p>
                <b>File:</b>{" "}
                <span>
                  <em>{task.submission.file_name}</em>
                  <button
                    onClick={handleDownload}
                    className="ml-2 bg-green-600 text-white px-2 py-1 rounded-md"
                  >
                    Download
                  </button>
                </span>
              </p>
              <p>
                <b>Submitted at:</b>{" "}
                <span>{formatDate(task.submission.submitted_at)}</span>
              </p>

              <div className="flex gap-2 mt-4">
                {currentUser.role === "admin" && (
                  <>
                    <button
                      onClick={() => router.push(`/projects/${projectId}`)}
                      className="bg-blue-700 text-white px-2 py-1 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => router.push(`/projects/${projectId}`)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md"
                    >
                      Reject
                    </button>
                  </>
                )}
                {currentUser.id === task.assignee_details.id && (
                  <>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/projects/${projectId}`)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )} */}
        </div>

        {/* Personal messages */}
        <h2 className="text-xl font-bold mb-2">
          Personal messages from the collaborator
        </h2>
        <div className="w-full min-h-[200px] bg-gray-100 p-4 rounded-md mb-4">
          <h2>No message received</h2>
        </div>

        {/* Action buttons */}
        <div className="w-full flex flex-row justify-around flex-wrap mb-4">
          <button
            onClick={() => router.push(`/projects/${projectId}`)}
            className="bg-gray-700 text-white px-2 py-1 rounded-md"
          >
            Go to project
          </button>
          {currentContributor!.user === task.assignee_details.user && (
            <>
              <button
                onClick={() => router.push(`/projects/${projectId}`)}
                className="bg-blue-700 text-white px-2 py-1 rounded-md"
              >
                Mark as in progress
              </button>
              <button
                onClick={() => router.push(`/projects/${projectId}`)}
                className="bg-red-600 text-white px-2 py-1 rounded-md"
              >
                Leave this task
              </button>
            </>
          )}
          {currentContributor!.role === "admin" && (
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="bg-red-600 text-white px-2 py-1 rounded-md"
            >
              Delete The Task
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}
