/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {useEffect, useState} from "react";
import {FaTrashAlt} from "react-icons/fa";
import {useAppContext} from "../components/context";

export default function ListPage() {
  const authState = useAppContext();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsLoading(true);
    fetch("http://localhost:8000/api/urls", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setList(data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);
  function handleDelete(id: number) {
    fetch(`http://localhost:8000/api/urls/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setList((prev) => prev.filter((item: ShortUrlRes) => item.id !== id));
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <div className="flex min-h-screen items-center justify-center font-sans gradient-background">
      <main className="flex min-h-screen w-full flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        {authState.isAuth ? (
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
            <div className="w-full flex justify-center">
              <h1 className="max-w-3xl text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Twoja lista Short Url
              </h1>
            </div>
            <div className="w-full flex justify-center">
              {isLoading ? (
                <div
                  role="status"
                  className="w-full flex justify-center align-middle"
                >
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#383838"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#ccc"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : list.length > 0 ? (
                <div className="flex flex-col gap-4 w-full">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="font-bold">Data stworzenia</div>
                    <div className="font-bold">Data wygaśniecia</div>
                    <div className="font-bold">Kliknięcia</div>
                    <div className="font-bold col-span-2">Alias</div>
                    <div className="font-bold">Akcje</div>
                    <div className="font-bold col-span-4">Url</div>
                    <div className="font-bold col-span-2">Short</div>
                    <hr className="col-span-6" />
                  </div>
                  <div className="grid grid-cols-6 gap-4 scroll-auto">
                    {list.map((shortUrl: ShortUrlRes) => (
                      <React.Fragment key={shortUrl.id}>
                        <div>
                          {new Date(shortUrl.createDate).toDateString()}
                        </div>
                        <div>
                          {shortUrl.expireDate
                            ? new Date(shortUrl.expireDate).toDateString()
                            : "Nie wygasa"}
                        </div>
                        <div>{shortUrl.clicks}</div>
                        <div className="col-span-2">
                          {shortUrl.alias ?? "-"}
                        </div>
                        <div>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background transition-colors hover:bg-[#f00]"
                            onClick={() => handleDelete(shortUrl.id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                        <div className="col-span-4">{shortUrl.fullLink}</div>
                        <div className="col-span-2">
                          <a
                            href={`http://localhost:8000/${shortUrl.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            http://localhost:8000/{shortUrl.shortCode}
                          </a>
                        </div>
                        <hr className="col-span-6 border-gray-500" />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div>Nie stworzyłeś jeszcze żadnych linków.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
            <div className="w-full flex justify-center">
              <h1 className="w-full text-3xl text-center font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Nie jesteś zalagowany.
              </h1>
            </div>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Aby tworzyć Short Url zaloguj się.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
