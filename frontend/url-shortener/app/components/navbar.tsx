"use client";
import Link from "next/link";
import {useState} from "react";
import {useAppContext} from "./context";
// import {useContext} from "react";
// import {AuthContext} from "../layout";

export default function Navbar() {
  // const [isSessionActive, setIsSessionActive] = useState<boolean>(
  //   localStorage.getItem("jwtToken") ? true : false,
  // );
  const authStatus = useAppContext();
  async function handleAuthClicked() {
    if (typeof window !== "undefined") {
      if (!authStatus.isAuth) {
        fetch("http://localhost:8000/api/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            localStorage.setItem("jwt", data.jwtToken);
            authStatus.setIsAuth(true);
            window.dispatchEvent(new Event("authstate"));
          })
          .catch((e) => {
            authStatus.setIsAuth(false);
            console.log(e);
          });
      } else {
        localStorage.removeItem("jwt");
        authStatus.setIsAuth(false);
      }
      window.dispatchEvent(new Event("authstate"));
    }
  }
  async function handleCheckClicked() {
    if (typeof window !== "undefined") {
      fetch("http://localhost:8000/api/session", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((e) => console.log(e));
    }
  }
  return (
    <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default bg-white dark:bg-black">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
            Skracacz Url
          </span>
        </Link>
        <div className="w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
            <li>
              <Link
                href="/shortener"
                className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
              >
                Stwórz
              </Link>
            </li>
            <li>
              <Link
                href="/mylist"
                className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
              >
                Moja Lista
              </Link>
            </li>
            <li>
              <Link
                href="/list"
                className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
              >
                Publiczna Lista
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <button
            type="button"
            className="flex h-8 w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
            onClick={handleAuthClicked}
          >
            {authStatus.isAuth ? "Wyloguj" : "Zaloguj2"}
          </button>
          <button
            type="button"
            className="flex h-8 w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
            onClick={handleCheckClicked}
          >
            Sprawdź Sesje
          </button>
        </div>
      </div>
    </nav>
  );
}
