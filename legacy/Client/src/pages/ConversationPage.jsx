import styles from "./ConversationPage.module.scss";
import images from "@icons/conversation/icons";
const ConversationPage = () => {
  const conversations = [1, 2, 3, 4];
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Conversations</h1>
      <hr className={styles.seperator} />

      {/* show all the Conversations */}
      <div className={styles["card-container"]}>
        {conversations.map((conversation) => (
          <div className={styles.card} key={conversation}>
            <div className={styles.left}>
              <div className={styles.icon}>
                <img
                  className={styles["conversation-icon"]}
                  src={images.message}
                  alt="message"
                />
              </div>
              <div className={styles.description}>
                <div>
                  <h2>Website Redesign</h2>
                  <p>18 Total Messages</p>
                </div>
                <p>
                  <b>Mehedi: </b> How are you all?
                </p>
              </div>
            </div>
            <div className={styles.right}>
              <p className={styles.time}>10:00am</p>
              <div className={styles.unread}>
                <p>3</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* loading */}
      {/* {loading && <Spinner />} */}

      {/* if no tasks */}
      {/* {tasks.length === 0 && (
          <h1 className={styles.empty}>
            No tasks have been assigned to you yet.
          </h1>
        )} */}
    </div>
  );
};

export default ConversationPage;
