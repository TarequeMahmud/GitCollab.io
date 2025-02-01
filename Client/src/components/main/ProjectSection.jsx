import styles from "@styles/main/ProjectSection.module.scss";
import { MdOutlineCreate } from "react-icons/md";
import datas from "@datas/bulkProjects.json";
import { useNavigate } from "react-router";
import generateFeatures from "@utils/generateFeatures.js";
import CardFeatures from "./CardFeatures";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

//TODO: Fetch the project from server
const ProjectSection = () => {
  //necessary hook variables
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  //find userdata from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData) navigate("/");
    setUserId(userData.user._id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/${userId}/project`,
          {
            method: "get",
            credentials: "include",
          }
        );
        const projectData = await response.json();

        if (projectData.error && !projectData.loggedIn) {
          localStorage.removeItem("userdata");
          setProjects([]);
          return navigate("/");
        }

        setProjects(projectData);
      } catch (error) {
        console.error("there was an error: ", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  useEffect(() => {}, [projects]);

  //setup handleClick for the feature buttons
  const handleRedirect = (project) => {
    const projectId = project._id;
    sessionStorage.setItem(
      `project-${projectId}`,
      JSON.stringify({ user: userId, project: project })
    );
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
            <h2>{data.name}</h2>

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
          navigate("/create");
        }}
      >
        <MdOutlineCreate width={10} height={10} />
      </div>
      {loading && <Spinner />}
    </>
  );
};

export default ProjectSection;
