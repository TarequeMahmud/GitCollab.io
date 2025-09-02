"use client";

import "@/styles/animations.css";

const Spinner = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex justify-center items-center z-[999]">
      <div className="relative h-[20vh] aspect-square border-[15px] border-[rgb(189,11,11)] rounded-full spinner-spin">
        <div className="absolute w-[15px] h-[15px] bg-[#a6ff00] rounded-full -top-[15px] left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default Spinner;
