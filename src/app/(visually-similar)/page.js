import Link from "next/link";
import SvgArrows from "./SvgArrows";
import JlptHomePageLinks from "./JlptHomePageLinks";
import SearchBarComponent from "../components/search/SearchBarComponent";

export default function Home() {


  return (
    <main>
      <div className="w-full">
        <div className="w-full flex justify-center items-center 
          bg-gradient-to-b from-sky-100 to-slate-50">
          <SearchBarComponent />
        </div>
        <div className="mx-auto max-w-7xl p-6 flex flex-col items-center">
          <div className="max-w-3xl py-4">
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

          <div className="max-w-3xl py-4 w-full flex justify-start">
            <section>
              <h1 id="latest-news" className="text-2xl text-pink-800 font-bold">Latest news</h1>
              <div className="py-2">
                <div className="flex flex-row gap-4">
                  <h2 className="text-2xl pb-2">Welcome!</h2>
                  {/* <span>- date here</span> */}
                </div>
                <div>
                  <p>
                    Welcome to the site, you can find info here.
                  </p>
                  <p>
                    The code for this site is available on Github.
                  </p>
                  <p className="grid justify-items-end py-1">
                    <Link className="underline" href="/news">Read more</Link>
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="max-w-3xl py-4">
            <section>
              <h1 className="text-2xl">Support us</h1>
              KoFI
            </section>
          </div>

          <div className="max-w-3xl py-4">
            <section>
              <h1 id="browse-by-jlpt-level" className="text-2xl mb-4 text-center">Browse By JLPT Level</h1>
              <div className="flex flex-row flex-wrap gap-6 justify-center">
                <JlptHomePageLinks enabled={true} href="/visually-similar/jlpt-level-5" level="N5" medal="bronze" />
                <JlptHomePageLinks enabled={true} href="/visually-similar/jlpt-level-4" level="N4" medal="silver" />
                <JlptHomePageLinks enabled={true} href="/visually-similar/jlpt-level-3" level="N3" medal="gold" />
                <JlptHomePageLinks enabled={true} href="/visually-similar/jlpt-level-2" level="N2" medal="platinum" />
                <JlptHomePageLinks enabled={false} href="/" level="N1" medal="" />
              </div>
            </section>
          </div>

        </div>
      </div >
    </main >

  )
}
