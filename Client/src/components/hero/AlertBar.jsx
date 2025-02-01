import styles from "@styles/hero/AlertBar.module.scss";
const AlertBar = ({ title, data, onClick }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <hr />
      <p>{data}</p>
      <hr />
      <button onClick={onClick}>Ok</button>
    </div>
  );
};

export default AlertBar;
