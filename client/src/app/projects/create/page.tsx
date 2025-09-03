"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/Spinner";
import authFetch from "@/services/fetch";
import Container from "@/components/Container";
import { useProjects } from "@/contexts/ProjectsContext";

//static files
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const commonInputClasses = "h-12 rounded-xl px-4 bg-gray-700 text-white";
const commonLabelClasses = "font-bold mb-1 text-lg";
const inputContainerDivClasses = "flex flex-col my-10";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { setIsAuthenticated } = useAuth();
  const { projects } = useProjects();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const { title, day, month, year, description } = Object.fromEntries(
      formData.entries()
    ) as Record<string, string>;
    const deadline = new Date(Number(year), Number(month), Number(day));
    const formObject = { title, deadline, description };

    try {
      setLoading(true);

      const response = await authFetch(
        "/project/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formObject),
        },
        setIsAuthenticated
      );

      if (response?.status === 400) {
        showAlert("Missing Fields", "Please insert required fields");
        return;
      }

      if (response?.status === 201) {
        showAlert(
          "Creation Success",
          "Your Project created successfully. Redirecting to projects page..."
        );
        console.log("Response data was:" + response);
        window.location.href = "/projects";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container title="CREATE A NEW PROJECT" content={true}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-4/5 mx-auto my-12 text-black"
      >
        <div className={inputContainerDivClasses}>
          <label htmlFor="title" className={commonLabelClasses}>
            Project Title:
          </label>
          <input
            type="text"
            name="title"
            required
            className={"w-full px-3 " + commonInputClasses}
          />
        </div>

        <div className={inputContainerDivClasses}>
          <label className={commonLabelClasses}>Deadline:</label>
          <div className="flex justify-between gap-4">
            <select
              name="day"
              required
              className={"w-1/5 " + commonInputClasses}
            >
              <option value="">Day</option>
              {[...Array(31).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="month"
              required
              className={"w-1/5 " + commonInputClasses}
            >
              <option value="">Month</option>
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              name="year"
              required
              className={"w-2/5 " + commonInputClasses}
            >
              <option value="">Year</option>
              {[...Array(10).keys()].map((i) => (
                <option key={2025 + i} value={2025 + i}>
                  {2025 + i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={inputContainerDivClasses}>
          <label htmlFor="description" className={commonLabelClasses}>
            Description:
          </label>
          <textarea
            name="description"
            rows={8}
            className="w-full resize-none h-72 rounded-md bg-gray-700 text-white p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-teal-600 text-black font-bold text-xl rounded-md mt-4"
        >
          CREATE
        </button>
      </form>

      {loading && <Spinner />}
    </Container>
  );
}
