import { useContext } from "react";
import styles from "../../styles/hero/HeroSection.module.scss";
import Account from "./Account";
import HeroTitle from "./HeroTitle";
import HomeContext from "@contexts/HomeContext";
import Logo from "./Logo";
import Nav from "./Nav";
console.log(styles["logo-navbar-container"]);

function HeroSection() {
  const home = useContext(HomeContext);

  return (
    <div className={`${styles.container} ${home ? styles.home : ""}`}>
      <div
        className={`${styles["logo-navbar-container"]} ${
          home ? styles["home-lnc"] : ""
        }`}
      >
        <Logo />
        <Nav />
        <Account />
      </div>
      {home && <HeroTitle />}
    </div>
  );
}

export default HeroSection;
