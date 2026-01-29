"use client";

import {useState} from "react";
import {useAppContext} from "../components/context";

export default function UrlShortenerPage() {
  const authStatus = useAppContext();
  const [fullLink, setFullLink] = useState<string>("");
  const [alias, setAlias] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [expire, setExpire] = useState<string>("no");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
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
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setError(e);
          setIsLoading(false);
        });
    }
  }
  return (
    <>
      <div className="flex min-h-screen items-center justify-center font-sans gradient-background">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
          {authStatus.isAuth ? (
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
              <div className="w-full flex justify-center">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                  Forma do skracania url
                </h1>
              </div>
              {!isLoading ? (
                <div className="w-full flex justify-center">
                  <span className="text-red-500">{error}</span>
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
                    <label
                      htmlFor="remember"
                      className="flex items-center mb-5"
                    >
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
              ) : (
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
              )}
            </div>
          ) : (
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
          )}
        </main>
      </div>
    </>
  );
}
