"use client";

import {createContext, ReactNode, useContext, useState} from "react";

type AuthStatus = {
  isAuth: boolean;
  setIsAuth: (newState: boolean) => void;
};

const AppContext = createContext<AuthStatus>({
  isAuth: false,
  setIsAuth: () => {},
});

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("No context");
  }
  return appContext;
};

export function AppContextProvider({children}: {children: ReactNode[]}) {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("jwt");
  });
  return (
    <AppContext.Provider value={{isAuth, setIsAuth}}>
      {children}
    </AppContext.Provider>
  );
}
