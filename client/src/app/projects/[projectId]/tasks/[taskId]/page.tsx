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
import ActionButton from "@/components/ActionButton";


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
  const [isEditing, setIsEditing] = useState(false);



  // fetch task
  useEffect(() => {
    if (!taskId || !currentUser) return;
    const fetchTask = async () => {
      try {
        const taskResponse = await fetchWithAuth(`/tasks/${taskId}`, {
          method: "GET",
        });

        if (!taskResponse) return alertOnError("Server Error", { status: 500 });
        if (!taskResponse.ok)
          return alertOnError("Error Retrieving Task", taskResponse);

        const taskData = await taskResponse.json();
        setTask(taskData);
        setSubmission(taskData.submission || null);
        setIsEditing(false);
        console.log("Task Data: ", taskData);

        setCurrentContributor(
          taskData.project_details.contributors.find(
            (contributor: Contributor) => contributor.user === currentUser.id
          ) || null
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
      const response = await fetchWithAuth(`/tasks/${taskId}/submissions/`, {
        method: submission ? "PUT" : "POST",
        body: formData,
      });

      if (!response) return alertOnError("Submission Failed", { status: 500 });
      if (!response.ok) return alertOnError("Submission Failed", response);

      // update local state with returned submission
      const data = await response.json();
      setSubmission(data);
      setTask((prev) => (prev ? { ...prev, submission: data } : prev));
      setIsEditing(false);

      showAlert("Submission Success", "Your task has been submitted.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!submission?.id) return;

    try {
      const response = await fetchWithAuth(
        `/tasks/${taskId}/submissions/${submission.id}/download/`,
        { method: "GET" }
      );

      if (!response.ok) {
        showAlert("Download Failed", "Could not download file.");
        return;
      }

      // Convert response to blob and trigger browser download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        submission.submission_file?.split("/").pop() || "downloaded_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  if (loading || !task) return <Spinner />;

  return (
    <Container title={task.title}>
      <div className="w-4/5 flex flex-col justify-start items-center mx-auto">
        {/* Title */}
        <div className="flex flex-row items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Assigned To:</h2>
          <p className="text-xl">
            {task.assignee_details.name} {" "}
            <em>(@{task.assignee_details.username})</em>
          </p>
        </div>

        {/* Task Info */}
        <div className="w-full bg-gray-100 p-4 rounded-md mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex justify-around">
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
        </div>

        {/* Description */}

        <div className="w-full bg-gray-100 p-4 rounded-md mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-start">{task.description}</p>
            {currentContributor?.role === "admin" && (
              <ActionButton variant="success" className="mt-3 flex items-center gap-2">
                <Image src={editIcon} alt="edit" className="w-5 h-5" /> Edit
              </ActionButton>
            )}
          </div>
        </div>

        {/* Submission Section */}
        <h2 className="text-xl font-bold mb-4">Submission Section</h2>

        <div className="w-full p-6 rounded-lg border border-gray-200 shadow-sm bg-white mb-6">
          {/* Case: No submission yet (admin view) */}
          {!submission && currentContributor?.role === "admin" && (
            <div className="text-gray-600 italic text-center py-6">
              Assignee has not submitted yet.
            </div>
          )}

          {/* Case: Assignee can submit or edit -> show form only when no submission OR when explicitly editing */}
          {currentContributor?.user === task.assignee_details.user && (!submission || isEditing) && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Textarea */}
              <div>
                <label
                  htmlFor="comment"
                  className="block font-semibold mb-2 text-gray-700"
                >
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
                <label
                  htmlFor="submission_file"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  File to submit:
                </label>
                <input
                  type="file"
                  name="submission_file"
                  required={!submission}
                  className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {submission?.submission_file && (
                  <p className="mt-2 text-sm text-gray-600">
                    <b>Current file:</b>{" "}
                    <em className="text-blue-700">{submission.submission_file}</em>
                  </p>
                )}
              </div>

              {/* Submit + optional cancel while editing */}
              <div className="flex justify-start items-center gap-3">
                <ActionButton type="submit" variant="primary">
                  {submission && isEditing ? "Save Changes" : "Submit Task"}
                </ActionButton>

                {isEditing && (
                  <ActionButton
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </ActionButton>
                )}
              </div>
            </form>
          )}

          {/* Submission view */}
          {submission && !isEditing && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="space-y-3 flex flex-col items-start">
                <p className="text-md text-gray-700">
                  <b className="font-semibold text-gray-900">Description:</b>{" "}
                  <span>{submission.comment}</span>
                </p>

                <p className="text-md text-gray-700 flex items-center">
                  <b className="font-semibold text-gray-900 mr-1">File:</b>{" "}
                  <em className="truncate max-w-xs">{submission.submission_file}</em>
                </p>
                <ActionButton onClick={handleDownload} variant="success">
                  Download
                </ActionButton>

                <p className="text-md text-gray-700">
                  <b className="font-semibold text-gray-900">Submitted at:</b>{" "}
                  <span>{formatDate(submission.created_at)}</span>
                </p>
              </div>

              <div className="flex gap-2 mt-5">
                {currentContributor?.role === "admin" && (
                  <>
                    <ActionButton
                      onClick={() => router.push(`/projects/${projectId}`)}
                      variant="primary"
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      onClick={() => router.push(`/projects/${projectId}`)}
                      variant="danger"
                    >
                      Reject
                    </ActionButton>
                  </>
                )}
                {currentContributor?.user === task.assignee_details.user && (
                  <>
                    <ActionButton
                      onClick={() => setIsEditing(true)}
                      variant="warning"
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      onClick={() => router.push(`/projects/${projectId}`)}
                      variant="danger"
                    >
                      Delete
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
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
          <ActionButton
            onClick={() => router.push(`/projects/${projectId}`)}
            variant="secondary"
          >
            Go to project
          </ActionButton>
          {currentContributor!.user === task.assignee_details.user && (
            <>
              <ActionButton
                onClick={() => router.push(`/projects/${projectId}`)}
                variant="primary"
              >
                Mark as in progress
              </ActionButton>
              <ActionButton
                onClick={() => router.push(`/projects/${projectId}`)}
                variant="danger"
              >
                Leave this task
              </ActionButton>
            </>
          )}
          {currentContributor!.role === "admin" && (
            <ActionButton
              onClick={() => router.push(`/projects/${projectId}`)}
              variant="danger"
            >
              Delete The Task
            </ActionButton>
          )}
        </div>
      </div>
    </Container>
  );
}
