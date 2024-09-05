'use client'

import Link from "next/link";
import LoginButton from "../buttons/login/LoginButton";
import { usePathname } from "next/navigation";

const HeaderMain = () => {

    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav aria-label="navigation-menu" className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6">
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
                    {
                        pathname !== '/' &&
                        <div className="flex items-center">
                            <Link
                                title="Go to search bar"
                                className="no-underline 
                            font-bold text-blue-900
                            items-center 
                            hidden sm:flex 
                            rounded-md gap-x-2 px-2 py-2.5
                            hover:bg-slate-50"
                                href="/#search">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 lg:size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <span className="hidden lg:inline">Search</span>
                            </Link>
                        </div>
                    }


                    <div className="flex items-center">
                        <Link title="Go to review settings page"
                            className="no-underline 
                            font-bold text-blue-900
                            items-center 
                            hidden sm:flex 
                            rounded-md gap-x-2 px-2 py-2.5
                            hover:bg-slate-50"
                            href="/news">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                            </svg>
                            <span className="hidden lg:inline">News</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link title="Go to review settings page"
                            className="no-underline 
                            font-bold text-blue-900
                            items-center 
                            hidden sm:flex 
                            rounded-md gap-x-2 px-2 py-2.5
                            hover:bg-slate-50"
                            href="/visually-similar/review-settings">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 lg:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                            <span className="hidden lg:inline">Start Reviews</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link title="Browse by JLPT Level"
                            className="no-underline 
                            font-bold text-blue-900
                            items-center 
                            hidden sm:flex 
                            rounded-md gap-x-2 px-2 py-2.5
                            hover:bg-slate-50"
                            href="/#browse-by-jlpt-level">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 lg:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            </svg>
                            <span className="hidden lg:inline">Browse by JLPT level</span>
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