/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {useEffect, useState} from "react";

export default function ListPage() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsLoading(true);
    fetch("http://localhost:8000/api/public", {
      method: "GET",
      headers: {
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
  return (
    <div className="flex min-h-screen items-center justify-center font-sans gradient-background">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <div className="w-full flex justify-center">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Lista publicznych linków
            </h1>
          </div>
          <div className="w-full flex justify-center">
            {isLoading ? (
              <div>Ładowanie...</div>
            ) : list.length > 0 ? (
              <div className="grid grid-cols-6 gap-4">
                <div className="font-bold">Twórca</div>
                <div className="font-bold">Data stworzenia</div>
                <div className="font-bold">Data wygaśniecia</div>
                <div className="font-bold">Kliknięcia</div>
                <div className="font-bold">Url</div>
                <div className="font-bold">Short</div>
                {list.map((shortUrl: ShortUrlRes, id) => (
                  <React.Fragment key={id}>
                    <div>{shortUrl.creator}</div>
                    <div>{new Date(shortUrl.createDate).toDateString()}</div>
                    <div>
                      {shortUrl.expireDate
                        ? new Date(shortUrl.expireDate).toDateString()
                        : "Nie wygasa"}
                    </div>
                    <div>{shortUrl.clicks}</div>
                    <div>{shortUrl.fullLink}</div>
                    <div>
                      <a
                        href={shortUrl.fullLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        http://localhost:8000/{shortUrl.shortCode}
                      </a>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div>Nie ma żadnych linków</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
