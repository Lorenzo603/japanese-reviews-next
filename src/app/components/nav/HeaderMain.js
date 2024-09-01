import Link from "next/link";
import LoginButton from "../buttons/login/LoginButton";

const HeaderMain = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6">
                <div className="flex">
                    <Link className="no-underline" href="/">
                        <div>
                            <h1 className="relative flex flex-row select-none items-baseline text-2xl font-bold mb-0">
                                <span className="tracking-tight text-pink-500 cursor-pointer">
                                    Visually
                                    <span className="text-pink-600">Similar</span>
                                    <span className="text-pink-700">Kanji</span>
                                </span>
                            </h1>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center justify-end gap-x-4">
                    <div className="flex items-center">
                        <Link
                            className="no-underline 
                            font-bold text-blue-900
                            items-center 
                            hidden md:flex 
                            rounded-md gap-x-2 px-2 py-2.5
                            hover:bg-slate-50"
                            href="/visually-similar/review-settings">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                            <span>Start Reviews</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link
                            className="no-underline 
                            font-bold text-blue-900
                            items-baseline 
                            hidden md:inline 
                            rounded-md px-2 py-2.5
                            hover:bg-slate-50"
                            href="/#browse-by-jlpt-level">
                            Browse by JLPT level
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <LoginButton />
                    </div>
                </div>
            </nav>

        </header>
    );
}

export default HeaderMain;