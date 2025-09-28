import { Outlet } from "react-router-dom";
import HeroSection from "./Header/HeroSection";
import FooterSection from "./FooterSection";

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
