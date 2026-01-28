"use client";

import {useState} from "react";
import {useAppContext} from "../components/context";

export default function UrlShortenerPage() {
  const authStatus = useAppContext();
  const [fullLink, setFullLink] = useState<string>("");
  const [alias, setAlias] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [expire, setExpire] = useState<string>("no");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (typeof window !== "undefined") {
      if (fullLink === "" || expire === "") {
        console.log("Pole url nie może być puste");
        return;
      }
      const now = new Date();
      const expireDate = expire !== "no" ? new Date(now) : undefined;
      switch (expire) {
        case "1h":
          expireDate!.setHours(expireDate!.getHours() + 1);
          break;
        case "1d":
          expireDate!.setDate(expireDate!.getDate() + 1);
          break;
        case "1t":
          expireDate!.setDate(expireDate!.getDate() + 7);
          break;
        case "no":
        default:
      }
      const shortUrl: ShortUrl = {
        fullLink: fullLink,
        isPublic: !isPrivate,
        createDate: now,
        expireDate: expireDate,
        alias: alias !== "" ? alias : undefined,
      };
      console.log(JSON.stringify(shortUrl));
      fetch("http://localhost:8000/api/urls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shortUrl),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  return (
    <>
      {authStatus.isAuth ? (
        <div className="flex min-h-screen items-center justify-center font-sans gradient-background">
          <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
              <div className="w-full flex justify-center">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                  Forma do skracania url
                </h1>
              </div>
              <div className="w-full flex justify-center">
                <form className="max-w-sm" onSubmit={handleFormSubmit}>
                  <div className="mb-5">
                    <label
                      htmlFor="url"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Link Url do skrócenia
                    </label>
                    <input
                      type="text"
                      id="url"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="mywebsite.com"
                      value={fullLink}
                      onChange={(e) => setFullLink(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="alias"
                      className="block mb-2.5 text-sm font-medium text-heading"
                    >
                      Alias (opcjonalny)
                    </label>
                    <input
                      type="text"
                      id="alias"
                      className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                      placeholder="Moja Strona"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                    />
                  </div>
                  <label htmlFor="remember" className="flex items-center mb-5">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                    />
                    <p className="ms-2 text-sm font-medium text-heading select-none">
                      Link Prywatny
                    </p>
                  </label>
                  <label
                    htmlFor="countries"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Czas wygaśniecia
                  </label>
                  <select
                    id="countries"
                    className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                    value={expire}
                    onChange={(e) => setExpire(e.target.value)}
                  >
                    <option value="no">Nie wygasa</option>
                    <option value="1h">godzina</option>
                    <option value="1d">dzień</option>
                    <option value="1t">tydzień</option>
                  </select>
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] mt-8"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center font-sans gradient-background">
          <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
              <div className="w-full flex justify-center">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                  Nie jesteś zalagowany.
                </h1>
              </div>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Aby tworzyć Short Url zaloguj się.
              </p>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
