import { useState, useRef, useEffect } from "react";
import icon from "../../assets/images/hero/user-regular.svg";
import styles from "../../styles/hero/Account.module.scss";
import useHideOutsideClick from "../../hooks/useHideOutsideClick";
import { useNavigate } from "react-router";

const Account = () => {
  const navigate = useNavigate();
  const ref = useRef();
  //Show or hide options
  const [showOptions, setShowOptions] = useState(false);
  //if has user data
  const [hasUserData, setHasUserData] = useState(false);
  useEffect(() => {
    setHasUserData(!!localStorage.getItem("userdata"));
  });

  useHideOutsideClick(ref, () => setShowOptions(false));
  //Add logout functionalities,
  const handleLogout = async () => {
    try {
      setShowOptions(false);

      const response = await fetch("http://localhost:5000/logout", {
        method: "GET",
        credentials: "include",
      });
      const responseData = await response.json();

      if (!responseData.loggedIn) {
        localStorage.removeItem("userdata");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
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
        {hasUserData && showOptions && (
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
