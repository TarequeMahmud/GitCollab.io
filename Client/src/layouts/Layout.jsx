import { Outlet } from "react-router-dom";
import HeroSection from "@comp/hero/HeroSection";
import FooterSection from "@comp/footer/FooterSection";

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
