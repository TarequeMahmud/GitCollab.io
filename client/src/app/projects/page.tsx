"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineCreate } from "react-icons/md";

import CardFeatures from "@/components/CardFeatures";
import Spinner from "@/components/Spinner";
import authFetch from "@/services/fetch";
import { useProjects } from "@/contexts/ProjectsContext";
import { useError } from "@/contexts/ErrorContex";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const { projects, setProjects } = useProjects();
  const alertOnError = useError();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectResponse = await authFetch("/project", { method: "get" });

        if (!projectResponse) {
          alertOnError("Couldn't Fetch Projects", { status: 500 });
          return;
        }
        if (!projectResponse.ok) {
          alertOnError("Couldn't Fetch Projects", projectResponse);
          return;
        }
        if (projectResponse.data.length === 0) return;

        setProjects(projectResponse.data);
      } catch (error) {
        console.error("There was an error: ", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (projects.length === 0) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Container title="PROJECTS" content={projects.length > 0}>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="grid grid-cols-2 justify-center gap-x-8 gap-y-12 p-10 w-full">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>

      <div
        className="fixed bottom-10 right-10 rounded-full w-15 h-15 bg-purple-600/30 flex items-center justify-center text-white text-2xl cursor-pointer hover:bg-pink-600/80 transition-transform"
        onClick={() => router.push("/projects/create")}
      >
        <MdOutlineCreate size={32} />
      </div>

      {loading && <Spinner />}
    </Container>
  );
}
