export default function UrlShortenerPage() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans gradient-background">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <div className="w-full flex justify-center">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Forma do skracania url
            </h1>
          </div>
          <div className="w-full flex justify-center">
            <form className="max-w-sm">
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
                />
              </div>
              <label htmlFor="remember" className="flex items-center mb-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                  required
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
  );
}
