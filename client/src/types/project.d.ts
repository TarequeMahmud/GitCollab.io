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

type Task = {
  _id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  status: "pending" | "in-progress" | "completed" | "to-do"; // adjust as needed
  priority: "low" | "medium" | "high"; // adjust if you support more
  comments: any[]; // refine if you have a comment type
  __v: number;

  project: {
    project_id: string;
    project_title: string;
  };

  assignee: {
    id: string;
    name: string;
    username: string;
  };

  submission: {
    text: string | null;
    file_name: string | null;
    file_path: string | null;
    submitted_at: string | null; // ISO date string or null
  };

  review: {
    reviewed_by: string | null;
    review_status: "pending" | "approved" | "rejected"; // extend if needed
    feedback: string | null;
  };
};
