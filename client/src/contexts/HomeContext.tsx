"use client";

import { createContext, ReactNode } from "react";
import { usePathname } from "next/navigation";

const HomeContext = createContext<boolean>(false);

type Props = {
  children: ReactNode;
};

export const HomeProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  console.log(isHome);

  return <HomeContext.Provider value={isHome}>{children}</HomeContext.Provider>;
};

export default HomeContext;
