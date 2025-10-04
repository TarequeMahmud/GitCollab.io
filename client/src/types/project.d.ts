enum Role {
  Admin = "admin",
  Manager = "manager",
  Member = "member",
}

type Contributor = {
  user: string;
  name: string;
  username: string;
  email: string;
  role: Role;
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

type AssigneeDetails = Omit<Contributor, 'added_at'>;

type ProjectDetails = Pick<Project, 'id' | 'title'> & {
  contributors?: Contributor[];
};

interface Submission {
  id: string;
  task: string;
  submitted_by: string;
  submission_file?: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
};

type Task = Omit<CreateTask, 'assignee' | 'project'> & {
  id: string;
  project_details: ProjectDetails;
  assignee_details: AssigneeDetails;
  submission?: Submission;
  created_at: string;
  updated_at: string;
};
