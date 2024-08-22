import Link from "next/link";
import SearchComponent from "./components/search/SearchComponent";
import HeaderComponent from "./components/nav/HeaderComponent";


export default function Home() {

  return (

    <div className="relative overflow-hidden">
      <main>
        <HeaderComponent />

        <div className="bg-pink-50 text-slate-900">
          <section>
            <div>
              <h1 className="sr-only">Search</h1>
              <div className="flex justify-center p-4">
                <div>
                  <SearchComponent />
                </div>
              </div>
              <div className="flex justify-center">
                <p>Search using kanji, meaning, or kana</p>
              </div>

            </div>
          </section>

          <div>
            <h1 id="browse-by-jlpt-level">Browse By JPLT Levels</h1>
            <section>
              <div>
                <Link href="/visually-similar/jlpt-level-5">JLPT 5</Link>
              </div>
              <div>
                <Link href="/visually-similar/jlpt-level-4">JLPT 4</Link>
              </div>
            </section>
          </div>

        </div>
      </main>

      <footer className="bg-pink-700 text-slate-100">
        <div className="flex">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 
             px-4 py-6">
            <p className="m-0">© {new Date().getFullYear()} Lorenzo Furrer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>


  )
}
