import Link from "next/link";
import SearchComponent from "./components/search/SearchComponent";
import HeaderComponent from "./components/nav/HeaderComponent";


export default function Home() {

  return (

    <div className="text-white">
      <HeaderComponent />

      <main className="bg-pink-50 text-slate-900">
        <div>
          <h1>Search</h1>
          <SearchComponent />
        </div>

        <div>
          <h1 id="browse-by-jlpt-level">Browse By JPLT Levels</h1>
          <section>
            <h2>JPLT Level 5</h2>
            <Link href="/visually-similar/jlpt-level-5">JLPT 5</Link>
          </section>
          <section>
            <h2>JPLT Level 4</h2>
            <Link href="/visually-similar/jlpt-level-4">JLPT 4</Link>
          </section>
        </div>

      </main>
    </div>


  )
}
