import Link from "next/link";
import SearchComponent from "../components/search/SearchComponent";
import SvgArrows from "./SvgArrows";

export default function Home() {

  const handleLevelNumberClick = (levelNumber) => {
    // window.location.href = '/visually-similar/test/level/' + levelNumber + '/batch/10';
    console.log('levelNumber:', levelNumber)
  }


  return (
    <main>
      <div className="w-full">
        <section>
          <div className="bg-gradient-to-b from-sky-100 to-slate-50">
            <h1 className="sr-only">Search</h1>
            <div className="flex justify-center p-4">
              <div>
                <SearchComponent />
              </div>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-7xl p-6">
          <div className="max-w-2xl py-4">
            <section>
              <h1 className="sr-only text-2xl">Reviews Settings</h1>
              <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                href="/visually-similar/review-settings">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <span>Start reviews</span>
                <SvgArrows />
              </Link>
            </section>
          </div>

          <div className="max-w-2xl">
            <section>
              <h1 id="browse-by-jlpt-level" className="text-2xl">Browse By JLPT Level</h1>
              <div className="pt-2 pb-2">
                <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                  href="/visually-similar/jlpt-level-5">JLPT 5
                  <SvgArrows />
                </Link>
              </div>
              <div className="pt-2 pb-2">
                <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                  href="/visually-similar/jlpt-level-4">JLPT 4
                  <SvgArrows />
                </Link>
              </div>
              <div className="pt-2 pb-2">
                <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                  href="/visually-similar/jlpt-level-3">JLPT 3
                  <SvgArrows />
                </Link>
              </div>
              <div className="pt-2 pb-2">
                <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                  href="/visually-similar/jlpt-level-2">JLPT 2
                  <SvgArrows />
                </Link>
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>

  )
}
