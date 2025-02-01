import styles from "../../styles/hero/Nav.module.scss";
import { navbarItems } from "@datas/navbar.json";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AlertBar from "./AlertBar";
const Nav = () => {
  const navigate = useNavigate();
  //if has user data
  const [hasUserData, setHasUserData] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  useEffect(() => {
    setHasUserData(!!localStorage.getItem("userdata"));
  });

  const handleClick = (link, data) => {
    if (hasUserData) {
      navigate(link);
    } else {
      setShowAlert(data);
      setTimeout(() => {
        setShowAlert(null);
      }, 3000);
    }
  };
  const handleButtonClick = () => {
    setShowAlert(null);
  };

  return (
    <div className={styles.container}>
      <ul>
        {navbarItems.map((items, index) => (
          <li onClick={() => handleClick(items.link, items.name)} key={index}>
            {items.name}
          </li>
        ))}
      </ul>
      {showAlert && (
        <AlertBar
          title={"Login Required"}
          data={`To continue with ${showAlert} you must be a valid user. Please login or Register to create an account.`}
          onClick={handleButtonClick}
        />
      )}
    </div>
  );
};

export default Nav;
