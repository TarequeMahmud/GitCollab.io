import style from "../../styles/hero/Nav.module.scss";
import { navbarItems } from "@datas/navbar.json";
import { NavLink } from "react-router-dom";
const Nav = () => {
  return (
    <div className={style.container}>
      <ul>
        {navbarItems.map((items, index) => (
          <NavLink to={items.link}>
            <li key={index}>{items.name}</li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
