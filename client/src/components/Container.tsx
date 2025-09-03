"use client";

import { ReactNode } from "react";

type Props = {
  type?: "default" | "modal";
  title?: string;
  children: ReactNode;
  content?: boolean;
};

const Container = ({
  type = "default",
  title = "",
  children,
  content = true,
}: Props) => {
  if (type === "modal") {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex justify-center items-center z-[900] p-3">
        {children}
      </div>
    );
  }

  return (
    <div className="w-5/6 mx-auto min-h-[600px] py-5 bg-gray-200 rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-3">
        {title.toUpperCase()}
      </h1>
      <hr className="border-gray-400 mb-6" />
      {!content && (
        <p className="text-center text-3xl mt-50 text-gray-600">
          No {title.toLowerCase()} available
        </p>
      )}
      {children}
    </div>
  );
};

export default Container;
