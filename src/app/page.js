import Link from "next/link";
import LoginButton from "./components/buttons/login/LoginButton";
import SearchComponent from "./components/search/SearchComponent";


export default function Home() {

  return (

    <div className='text-white'>
      <header>
        <nav>
          <a>Browse by JPLT level</a>
          <a>Browse by WK level</a>
        </nav>
        <div>
          <LoginButton />
        </div>
      </header>

      <main>
        <div>
          <h1>Search</h1>
          <SearchComponent />
        </div>

        <div>
          <h1>Browse By JPLT Levels</h1>
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
