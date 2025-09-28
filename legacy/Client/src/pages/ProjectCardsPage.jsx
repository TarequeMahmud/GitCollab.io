import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MdOutlineCreate } from "react-icons/md";
//Necessary Imports
import styles from "./ProjectCardsPage.module.scss";
import generateFeatures from "@utils/generateFeatures.js";
import CardFeatures from "@comp/CardFeatures";
import Spinner from "@comp/Spinner";
import authFetch from "@services/fetch.js";
import { useProjects } from "@contexts/ProjectsContext.jsx";
import { useError } from "../contexts/ErrorContex";

const ProjectSection = () => {
  //necessary hook variables

  const alertOnError = useError();
  const { projects, setProjects } = useProjects();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectResponse = await authFetch(
          "/project",
          {
            method: "get",
          },
          navigate
        );

        if (!projectResponse) {
          alertOnError("Coudn't Fetch Projects", { status: 500 });
          return null;
        }

        if (!projectResponse.ok) {
          alertOnError("Coudn't Fetch Projects", projectResponse);
          return null;
        }
        if (projectResponse.data.length === 0) {
          return null;
        }

        setProjects(projectResponse.data);
      } catch (error) {
        console.error("There was an error: ", error);
        navigate("/");
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

  //setup handleClick for the feature buttons
  const handleRedirect = (project) => {
    const projectId = project._id;

    navigate(`/projects/${projectId}`);
  };

  return (
    <>
      <div className={styles.heading}>
        <h1>MY PROJECTS</h1>
      </div>
      <div className={styles.container}>
        {projects.map((data, index) => (
          <div key={index} className={styles["project-card"]}>
            <h2>{data.title}</h2>

            <p className={styles.description}>
              {data.description.length > 100
                ? `${data.description.slice(0, 100)}...`
                : data.description}
            </p>
            <hr className={styles["card-separator"]} />
            <div className={styles["features-container"]}>
              {generateFeatures(data).map((feature, index) => (
                <CardFeatures
                  key={index}
                  icon={feature.icon}
                  info={feature.info}
                  styles={{
                    holder: styles["feature-holder"],
                    title: styles["feature-title"],
                    icon: styles["feature-icon"],
                  }}
                />
              ))}
            </div>
            <hr className={styles["card-separator"]} />
            <button
              onClick={() => handleRedirect(data)}
              className={styles["card-button"]}
            >
              See Project
            </button>
          </div>
        ))}
      </div>
      <div
        className={styles["add-button"]}
        onClick={() => {
          navigate("/projects/create");
        }}
      >
        <MdOutlineCreate width={10} height={10} />
      </div>
      {loading && <Spinner />}
    </>
  );
};

export default ProjectSection;
