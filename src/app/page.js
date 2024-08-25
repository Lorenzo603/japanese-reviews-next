import Link from "next/link";
import SearchComponent from "./components/search/SearchComponent";

export default function Home() {

  return (
    <main>
      <div>
        <section>
          <div>
            <h1 className="sr-only">Search</h1>
            <div className="flex-1 sm:flex justify-center p-4 pb-1">
              <div>
                <SearchComponent />
              </div>
            </div>
            <div className="flex justify-center">
              <p className="italic">Search using kanji, meaning, or kana</p>
            </div>

          </div>
        </section>

        <div className="p-2">
          <section>
            <h1 id="browse-by-jlpt-level" className="text-2xl">Browse By JPLT Level</h1>
            <div className="pt-2 pb-2">
              <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                href="/visually-similar/jlpt-level-5">JLPT 5 &gt;&gt;</Link>
            </div>
            <div className="pt-2 pb-2">
              <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                href="/visually-similar/jlpt-level-4">JLPT 4 &gt;&gt;</Link>
            </div>
            <div className="pt-2 pb-2">
              <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                href="/visually-similar/jlpt-level-3">JLPT 3 &gt;&gt;</Link>
            </div>
            <div className="pt-2 pb-2">
              <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                href="/visually-similar/jlpt-level-2">JLPT 2 &gt;&gt;</Link>
            </div>
          </section>
        </div>

      </div>
    </main>

  )
}
