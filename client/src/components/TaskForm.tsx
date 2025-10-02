"use client";

import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useAlert } from "@/contexts/AlertContext";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/Spinner";
import Container from "./Container";



type TaskFormProps = {
  isShown: (value: boolean) => void;
  userId: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

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

const statuses = [
  { value: "to-do", label: "To-do" },
  { value: "in-progress", label: "In-progress" },
  { value: "completed", label: "Completed" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 10 }, (_, i) => 2025 + i);

const InputField = ({
  label,
  name,
  required = false,
  inputProps = {},
  className = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}) => (
  <div className="flex flex-col items-start w-full mb-4">
    <label htmlFor={name} className="font-extrabold text-lg mb-2">
      {label}
    </label>
    <input
      name={name}
      required={required}
      {...inputProps}
      className={`w-full px-2 h-11 rounded-md bg-[#7e5252] text-white ${className}`}
    />
  </div>
);

const SelectField = ({
  label,
  name,
  options,
  required = false,
  selectClass = "w-full h-11",
  defaultOption,
}: {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  required?: boolean;
  selectClass?: string;
  defaultOption?: string;
}) => (
  <div className="flex flex-row justify-between items-center w-full">
    <p className="font-extrabold text-lg">{label}</p>
    <select
      name={name}
      required={required}
      className={`${selectClass} rounded-md bg-[#7e5252] text-white`}
    >
      {defaultOption && <option value="">{defaultOption}</option>}
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const TextareaField = ({
  label,
  name,
  rows = 10,
  className = "",
}: {
  label: string;
  name: string;
  rows?: number;
  className?: string;
}) => (
  <div className="flex flex-col items-start w-full mb-4">
    <label htmlFor={name} className="font-extrabold text-lg mb-2">
      {label}
    </label>
    <textarea
      name={name}
      rows={rows}
      className={`w-full h-[300px] p-2 resize-none bg-[#7e5252] text-white rounded-md ${className}`}
    ></textarea>
  </div>
);

const TaskForm = ({ isShown, userId, setTasks }: TaskFormProps) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { fetchWithAuth } = useAuth();

  const handleClose = () => isShown(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { title, status, priority, day, month, year, description } =
      Object.fromEntries(formData.entries());

    const deadline = new Date(Number(year), Number(month), Number(day));
    const formObject = {
      title,
      status,
      priority,
      project: projectId,
      assignee: userId,
      deadline,
      description,
    };

    try {
      setLoading(true);
      const createTaskResponse = await fetchWithAuth(
        '/tasks/',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formObject),
        }
      )

      console.log(createTaskResponse);

      if (createTaskResponse.status === 400)
        showAlert("Missing Fields", "Please insert required fields");
      if (createTaskResponse.status === 404)
        showAlert("Project Not Found", "You are seems to be wrong place.");

      if (createTaskResponse.status === 201) {
        showAlert(
          "Creation Success",
          "Task assigned successfully. You will show the task card following the collaborators' table."
        );

        const newTask: Task = await createTaskResponse.json();
        setTasks((prev) => [...prev, newTask]);

        isShown(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container type="modal">
        <div className="w-3/4 max-h-[90%] overflow-y-auto bg-gray-200 p-8 rounded-2xl border-2 border-black shadow-lg flex flex-col items-center no-scrollbar">
          <div className="w-full flex justify-between items-center mb-8">
            <div></div>
            <h1 className="text-2xl font-bold">CREATE A NEW TASK</h1>
            <IoMdCloseCircle
              onClick={handleClose}
              className="w-10 h-10 text-red-600 cursor-pointer"
            />
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            {/* Title */}
            <InputField label="Project Title:" name="title" required />

            {/* Status & Priority */}
            <div className="flex flex-row justify-between gap-10 my-12">
              <div className="flex flex-row justify-between items-center w-full">
                <SelectField
                  label="Status:"
                  name="status"
                  options={statuses}
                  required
                  selectClass="h-11 w-3/4"
                />
              </div>

              <div className="flex flex-row justify-between items-center w-full">
                <SelectField
                  label="Priority:"
                  name="priority"
                  options={priorities}
                  required
                  selectClass="h-11 w-3/4"
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="flex flex-row justify-between items-center w-full mb-4">
              <p className="font-extrabold text-lg mb-2">Deadline:</p>
              <div className="flex flex-row justify-around items-center gap-4 w-4/5">
                <select
                  name="day"
                  required
                  className="w-1/5 h-11 rounded-md bg-[#7e5252] text-white"
                >
                  <option value="">Day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  name="month"
                  required
                  className="w-1/5 h-11 rounded-md bg-[#7e5252] text-white"
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
                  className="w-2/5 h-11 rounded-md bg-[#7e5252] text-white"
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <TextareaField label="Description:" name="description" rows={10} />

            <button
              type="submit"
              className="w-full h-12 bg-[#0aa485] text-black font-bold text-xl my-5 rounded-md"
            >
              CREATE
            </button>
          </form>
        </div>
      </Container>

      {loading && <Spinner />}
    </>
  );
};

export default TaskForm;
