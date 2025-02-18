import { useEffect } from "react";
import styles from "./UserdataModal.module.scss";
const UserdataModal = ({ userObject }) => {
  const { userdata, setUserdata } = userObject;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await authFetch(
          `/checkuser/${userdata._id}`,
          {
            method: "get",
          },
          navigate
        );
        console.log("project data: ", userResponse.data);

        if (!userResponse) {
          setProjects([]);
          showAlert(
            "Error",
            "Something error occured to make request. Server seems not to be working."
          );
          return null;
        }

        if (userResponse.status !== 200) {
          setProjects([]);
          showAlert("Error", "Something error occured fetching user.");
          return null;
        }
        if (userResponse.data.length === 0) {
          setProjects([]);
          showAlert(
            "No User Found",
            "The user you requested is not currently collaborating in this project."
          );
          return null;
        }

        setProjects(userResponse.data);
      } catch (error) {
        console.error("there was an error: ", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userdata._id]);

  return (
    <div className={styles.container}>
      <div className={styles["data-container"]}>
        <h2>{userdata.name}</h2>
        <p className={styles.description}>
          {userdata.about.length > 200
            ? `${userdata.about.slice(0, 200)}...`
            : userdata.about}
        </p>
        <hr className={styles["card-separator"]} />
        <button
          onClick={() => setUserdata(null)}
          className={styles["card-button"]}
        >
          See Project
        </button>
      </div>
    </div>
  );
};

export default UserdataModal;
/*          <div key={index} className={styles["project-card"]}>
            <h2>{data.title}</h2>



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
            
          </div> */
