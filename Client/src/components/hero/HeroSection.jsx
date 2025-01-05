import styles from "../../styles/hero/HeroSection.module.css";
import Account from "./Account";
import HeroTitle from "./HeroTitle";
import Logo from "./Logo";
import Nav from "./Nav";

function HeroSection() {
  return (
    <div className={styles.container}>
      <div className={styles["logo-navbar-container"]}>
        <Logo />
        <Nav />
        <Account />
      </div>
      <HeroTitle />
    </div>
  );
}

export default HeroSection;
