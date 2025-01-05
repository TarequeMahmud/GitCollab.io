import style from "../../styles/hero/Nav.module.css";
const navbarItems = [
  "Home",
  "Projects",
  "Tasks",
  "Notification",
  "Activity Feed",
];
const Nav = () => {
  return (
    <div className={style.container}>
      <ul>
        {navbarItems.map((items, index) => (
          <li key={index}>{items}</li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
