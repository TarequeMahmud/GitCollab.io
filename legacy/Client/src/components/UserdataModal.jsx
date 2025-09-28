import { useEffect, useState } from "react";
import styles from "./UserdataModal.module.scss";
import authFetch from "@services/fetch.js";
import { useNavigate } from "react-router";
const UserdataModal = ({ userObject, tasks }) => {
  const { userdata, setUserdata } = userObject;
  const [userinfo, setUserinfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const taskForUser = tasks.filter(
    (task) => task.assigned_to === userdata.user_id
  );
  const taskFilter = (status) =>
    taskForUser.filter((task) => task.status === status);
  console.log(taskForUser);
  useEffect(() => {
    if (!userdata.user_id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userResponse = await authFetch(`/checkuser/${userdata.user_id}`, {
          method: "get",
        });
        console.log("user data: ", userResponse);
        setUserinfo(userResponse.data);
      } catch (error) {
        console.error("there was an error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userdata]);

  return (
    <div className={styles.container}>
      <div className={styles["data-container"]}>
        {loading && <p className={styles.loading}>Loading data...</p>}
        {userinfo && (
          <>
            <h1>{userinfo.name}</h1>
            <hr className={styles["card-separator"]} />
            <div className={styles["features-container"]}>
              <div>
                <h3>Username:</h3>
                <p> {userinfo.username}</p>
              </div>
              <div>
                <h3>Email:</h3>
                <p> {userinfo.email}</p>
              </div>
              <div>
                <h3>Role:</h3>
                <p> {userdata.role.toUpperCase()}</p>
              </div>
              <div>
                <h3>Total Tasks Assigned:</h3>
                <p> {taskForUser.length}</p>
              </div>
              <div>
                <h3>Tasks Stats:</h3>
                <p>
                  <b>{taskFilter("completed").length}</b> completed;{" "}
                  <b>{taskFilter("in-progress").length}</b> in progress;{" "}
                  <b>{taskFilter("to-do").length}</b> to-do;
                </p>
              </div>
            </div>

            <hr className={styles["card-separator"]} />
            <p className={styles.description}>
              {userinfo.about.length > 200
                ? `${userinfo.about.slice(0, 200)}...`
                : userinfo.about}
            </p>
            <hr className={styles["card-separator"]} />
            <button
              onClick={() => setUserdata(null)}
              className={styles["card-button"]}
            >
              OK
            </button>
          </>
        )}
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
