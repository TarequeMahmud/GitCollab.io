"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import icon from "@/assets/images/hero/user-regular.svg";
import useHideOutsideClick from "@/hooks/useHideOutsideClick";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectsContext";

const Account = () => {
  const { isAuthenticated, logout } = useAuth();
  const { setProjects } = useProjects();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [showOptions, setShowOptions] = useState(false);

  useHideOutsideClick(ref, () => setShowOptions(false));

  const handleLogout = async () => {
    try {
      setShowOptions(false);
      logout();
      setProjects([]);
      router.push("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center w-[60px] h-[60px] min-h-[40px] rounded-full border-2 border-[#04c289] bg-white cursor-pointer hover:bg-[#04c289] m-[3px]"
      onClick={() => {
        if (!isAuthenticated) {
          router.push("/auth");
        } else {
          setShowOptions(!showOptions);
        }
      }}
    >
      <Image src={icon} alt="account-logo" className="w-3/5 h-3/5 m-auto" />

      {isAuthenticated && showOptions && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[60px] right-[50px] w-[150px] h-[100px] bg-white border-2 border-black rounded-lg shadow-md flex flex-col overflow-hidden text-black cursor-pointer"
        >
          <p
            onClick={handleLogout}
            className="flex-1 text-lg p-1 hover:bg-[#04c289] text-center"
          >
            Logout
          </p>
          <hr className="w-full m-0" />
          <p className="flex-1 text-lg p-1 hover:bg-[#04c289] text-center">
            Settings
          </p>
        </div>
      )}
    </div>
  );
};

export default Account;
