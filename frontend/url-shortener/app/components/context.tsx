"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const authState = useMemo(() => ({isAuth, setIsAuth}), [isAuth]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuth(!!localStorage.getItem("jwt"));
  }, []);
  return (
    <AppContext.Provider value={authState}>{children}</AppContext.Provider>
  );
}
