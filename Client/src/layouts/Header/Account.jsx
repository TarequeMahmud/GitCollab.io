import { useState, useRef, useContext } from "react";
import icon from "@/assets/images/hero/user-regular.svg";
import styles from "./Account.module.scss";
import useHideOutsideClick from "@/hooks/useHideOutsideClick";
import { useNavigate } from "react-router";
import { AuthContext } from "@contexts/AuthContext.jsx";

const Account = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const ref = useRef();
  //Show or hide options
  const [showOptions, setShowOptions] = useState(false);

  useHideOutsideClick(ref, () => setShowOptions(false));
  //Add logout functionalities,
  const handleLogout = async () => {
    try {
      setShowOptions(false);
      logout();
      navigate("/auth");
    } catch (error) {
      console.error(error);
      return;
    }
  };
  return (
    <>
      <div
        className={styles.container}
        ref={ref}
        onClick={(e) => {
          setShowOptions(!showOptions);
        }}
      >
        <img src={icon} alt="account-logo" className={styles.img} />
        {isAuthenticated && showOptions && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles["option-container"]}
          >
            <p onClick={handleLogout} className={styles.option}>
              Logout
            </p>
            <hr />
            <p className={styles.option}>Settings</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
