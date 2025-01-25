import style from "../../styles/hero/Nav.module.scss";
import { navbarItems } from "@datas/navbar.json";
import { NavLink } from "react-router-dom";
const Nav = () => {
  return (
    <div className={style.container}>
      <ul>
        {navbarItems.map((items, index) => (
          <NavLink key={index} to={items.link}>
            <li>{items.name}</li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
