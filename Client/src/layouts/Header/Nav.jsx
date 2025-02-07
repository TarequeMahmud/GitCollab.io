import styles from "./Nav.module.scss";
import { navbarItems } from "@datas/navbar.json";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { AuthContext } from "@contexts/AuthContext";
import { useAlert } from "@contexts/AlertContext";

const Nav = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { alert, showAlert } = useAlert();

  const handleClick = (link, name) => {
    if (isAuthenticated) {
      navigate(link);
    } else {
      showAlert(
        "Login Required",
        `To continue with ${name} you must be a valid user. Please login or Register to create an account.`
      );
    }
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
    </div>
  );
};

export default Nav;
