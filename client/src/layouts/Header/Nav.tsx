"use client";
import { navbarItems } from "@/assets/data/navbar.json";

import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import Link from "next/link";

const Nav = () => {
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  return (
    <div className="w-1/2 h-[50px] bg-white/20 ml-[34%] m-0 p-0 rounded-lg">
      <ul className="my-0 mx-auto p-[10px_20px] w-full h-full flex flex-row justify-evenly items-center flex-wrap">
        {navbarItems.map((item, index) => (
          <li
            key={index}
            className="m-0 list-none font-extrabold text-white cursor-pointer hover:text-[#04c289]"
          >
            <Link
              href={item.link}
              onClick={(e) => {
                if (!isAuthenticated && item.name !== "Home") {
                  e.preventDefault();
                  showAlert(
                    "Login Required",
                    `To continue with ${item.name} you must be a valid user. Please login or Register to create an account.`
                  );
                }
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
