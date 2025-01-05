import icon from "../../assets/images/hero/user-regular.svg";
import styles from "../../styles/hero/Account.module.css";
const Account = () => {
  return (
    <div className={styles.container}>
      <img src={icon} alt="account-logo" className={styles.img} />
    </div>
  );
};

export default Account;
