import { useAlert } from "@contexts/AlertContext";
import styles from "./AlertBar.module.scss";

const AlertBar = () => {
  const { alert, setAlert } = useAlert();
  if (!alert) return null;
  return (
    <div className={styles.container}>
      <h3>{alert.title}</h3>
      <hr />
      <p>{alert.message}</p>
      <hr />
      <button onClick={() => setAlert(null)}>OK</button>
    </div>
  );
};

export default AlertBar;
