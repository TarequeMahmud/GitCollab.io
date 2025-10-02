type Contributor = {
  user: string;
  name: string;
  username: string;
  email: string;
  role: string;
  added_at: string | Date;
};

type Project = {
  id: string;
  title: string;
  description: string;
  contributors: Contributor[];
  created_at: string | Date;
  updated_at: string | Date;
  deadline: string | Date;
};

type Feature = {
  icon: StaticImageData;
  info: string;
};

type ProjectsContextType = {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

type CreateTask = {
  project: string;
  assignee: string;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "in-progress" | "completed" | "to-do";
  priority: "low" | "medium" | "high";
};

type Task = CreateTask & {
  id: string;
  assignee_details: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
};
