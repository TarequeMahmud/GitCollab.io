"use client";
import { useRouter } from "next/navigation";
import CardFeatures from "./CardFeatures";
import generateFeatures from "@/utils/generateFeatures";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const router = useRouter();
  const handleRedirect = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="h-[400px] w-[450px] bg-white/70 rounded-[45px] border-2 border-[#ffffffb6] p-4 flex flex-col justify-start items-center shadow-[4px_4px_4px_rgba(0,0,0,0.5)]">
      <h2 className="text-black text-2xl font-bold">{project.title}</h2>
      <p className="my-4 w-[95%] h-[40px] text-sm">
        {project.description.length > 70
          ? `${project.description.slice(0, 70)}...`
          : project.description}
      </p>

      <hr className="w-[95%] border-gray-400 my-2" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 h-60 w-[95%] p-2">
        {generateFeatures(project).map((feature, idx) => (
          <CardFeatures key={idx} icon={feature.icon} info={feature.info} />
        ))}
      </div>

      <hr className="w-[95%] border-gray-400 my-2" />

      <button
        onClick={() => handleRedirect(project)}
        className="w-2/5 h-[40px] mt-5 mx-auto rounded-lg cursor-pointer text-white bg-[#0079ca]"
      >
        See Project
      </button>
    </div>
  );
};

export default ProjectCard;
