type Person = {
  role: string;
  name: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  people: Person[];
  createdAt: string | Date;
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
