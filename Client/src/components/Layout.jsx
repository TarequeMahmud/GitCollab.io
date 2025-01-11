import { Outlet } from "react-router-dom";
import HeroSection from "./hero/HeroSection";
import FooterSection from "./footer/FooterSection";

const Layout = () => {
  return (
    <>
      <HeroSection />
      <Outlet />
      <FooterSection />
    </>
  );
};

export default Layout;
