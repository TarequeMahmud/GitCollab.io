import styles from "@styles/main/Spinner.module.scss";
const Spinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
