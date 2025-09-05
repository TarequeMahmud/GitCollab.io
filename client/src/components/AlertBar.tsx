"use client";

import { useAlert } from "@/contexts/AlertContext";

const AlertBar = () => {
  const { alert } = useAlert();
  if (!alert) return null;

  return (
    <div
      className="
        fixed top-2 left-1/2 -translate-x-1/2
        w-[300px] min-h-[150px] h-auto
        bg-[rgb(0,139,163)] text-white
        border-2 border-black rounded-2xl shadow-md
        p-3 z-[999]
      "
    >
      <h3 className="w-full text-xl font-bold m-0">{alert.title}</h3>
      <hr className="border-white my-2" />
      <p className="w-full text-base p-1">{alert.message}</p>
    </div>
  );
};

export default AlertBar;
