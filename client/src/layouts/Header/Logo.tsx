"use client";

import Image from "next/image";
import logo from "@/assets/images/hero/logo.png";

const Logo = () => {
  return (
    <div className="flex flex-row justify-between items-center h-full w-[10%]">
      <Image src={logo} alt="logo" width={50} height={50} />

      <h1 className="ml-2 text-3xl font-bold text-center text-white">
        GitCollab.io
      </h1>
    </div>
  );
};

export default Logo;
