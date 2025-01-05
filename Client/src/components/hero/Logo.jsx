import logo from "../../assets/images/hero/logo.png";
import styles from "../../styles/hero/Logo.module.css";
function Logo() {
  return (
    <div className={styles["logo-container"]}>
      <div>
        <img src={logo} height={50} width={50} />
      </div>
      <div>
        <h1>CollabTask</h1>
      </div>
    </div>
  );
}

export default Logo;
