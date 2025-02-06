import logo from "@/assets/images/hero/logo.png";
import styles from "./Logo.module.scss";
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
