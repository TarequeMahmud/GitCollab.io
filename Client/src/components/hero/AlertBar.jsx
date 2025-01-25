import styles from "@styles/hero/AlertBar.module.scss";
const AlertBar = ({ title, data }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <hr />
      <p>{data}</p>
    </div>
  );
};

export default AlertBar;
