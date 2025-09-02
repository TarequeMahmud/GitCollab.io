"use client";

import { useContext } from "react";
import { navbarItems } from "@/assets/data/navbar.json";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";

const Nav = () => {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const handleClick = (link: string, name: string) => {
    if (name === "Home") {
      router.push(link);
      return;
    }
    if (isAuthenticated) {
      router.push(link);
    } else {
      showAlert(
        "Login Required",
        `To continue with ${name} you must be a valid user. Please login or Register to create an account.`
      );
    }
  };

  return (
    <div className="w-1/2 h-[50px] bg-white/20 ml-[34%] m-0 p-0">
      <ul className="my-0 mx-auto p-[10px_20px] w-full h-full flex flex-row justify-evenly items-center flex-wrap">
        {navbarItems.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item.link, item.name)}
            className="m-0 list-none font-extrabold text-white cursor-pointer hover:text-[#04c289]"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
