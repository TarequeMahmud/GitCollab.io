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
  const [submission, setSubmission] = useState<Submission | null>(null);

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
        setSubmission(taskData.submission || null);
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
    const file = formData.get("submission_file") as File | null;
    const maxSize = 1024 * 1024;

    if (file && file.size > maxSize) {
      alertOnError("Big file size", {
        message: "File size exceeds 1MB. Please upload a smaller file.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/tasks/${taskId}/submissions/`,
        {
          method: submission ? "PUT" : "POST",
          body: formData,
        },

      );

      if (!response) return alertOnError("Submission Failed", { status: 500 });
      if (!response.ok) return alertOnError("Submission Failed", response);

      showAlert("Submission Success", "Your task has been submitted.");

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.location.href = `http://localhost:5000/tasks/${taskId}/downloads`;
  };

  if (loading || !task) return <Spinner />;

  return (
    <Container title={task.title}>
      <div className="w-4/5 flex flex-col justify-start items-center mx-auto">


        {/* Title */}
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
        <h2 className="text-xl font-bold mb-4">Submission Section</h2>

        <div className="w-full p-6 rounded-lg border border-gray-200 shadow-sm bg-white mb-6">
          {/* Case: No submission yet */}
          {!submission && currentContributor?.role === "admin" && (
            <div className="text-gray-600 italic text-center py-6">
              Assignee has not submitted yet.
            </div>
          )}

          {/* Case: Assignee can submit */}
          {currentContributor?.user === task.assignee_details.user && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Textarea */}
              <div>
                <label htmlFor="comment" className="block font-semibold mb-2 text-gray-700">
                  Text to submit:
                </label>
                <textarea
                  name="comment"
                  defaultValue={submission?.comment ?? ""}
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your submission text here..."
                />
              </div>

              {/* File input */}
              <div>
                <label htmlFor="submission_file" className="block font-semibold mb-2 text-gray-700">
                  File to submit:
                </label>
                <input
                  type="file"
                  name="submission_file"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {task.submission?.submission_file && (
                  <p className="mt-2 text-sm text-gray-600">
                    <b>Current file:</b>{" "}
                    <em className="text-blue-700">{task.submission.submission_file}</em>
                  </p>
                )}
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-colors"
                >
                  Submit Task
                </button>
              </div>
            </form>
          )}
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
