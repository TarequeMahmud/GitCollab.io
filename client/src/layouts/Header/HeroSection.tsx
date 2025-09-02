"use client";

import { useContext } from "react";
import Account from "./Account";
import HeroTitle from "./HeroTitle";
import HomeContext from "@/contexts/HomeContext";
import Logo from "./Logo";
import Nav from "./Nav";
import heroBg from "@/assets/images/hero/hero-background.jpg";

const HeroSection = () => {
  const home = useContext(HomeContext);
  /*

*/
  return (
    <div
      className={`w-full flex flex-col justify-center items-center border-b border-[#05155e] transition-all duration-300 ${
        home ? "h-72" : "h-20"
      } bg-blue-950`}
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`w-full mx-auto px-2.5 flex flex-row items-center justify-between transition-all duration-500 ${
          home ? "h-2/5 mt-[-10%]" : ""
        }`}
      >
        <Logo />
        <Nav />
        <Account />
      </div>
      {home && <HeroTitle />}
    </div>
  );
};

export default HeroSection;
