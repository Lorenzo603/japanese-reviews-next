'use client'

import Link from "next/link";
import LoginButton from "../buttons/login/LoginButton";
import { usePathname } from "next/navigation";
import Image from "next/image";
import HeaderLinkComponent from "./HeaderLinkComponent";
import HeaderLinkNewsIcon from "./HeaderLinkNewsIcon";
import HeaderLinkReviewSettingsIcon from "./HeaderLinkReviewSettingsIcon";
import HeaderLinkBrowseJlptIcon from "./HeaderLinkBrowseJlptIcon";

const HeaderMain = () => {

    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav aria-label="navigation-menu" className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6">
                <div className="flex">
                    <Link className="no-underline" href="/">
                        <div className="flex items-center gap-x-2">
                            <Image src="/img/logos/tomomoji-logo.png" alt="" width={48} height={48} />
                            <h1 className="relative flex flex-row select-none items-baseline text-2xl font-bold mb-0">
                                <span className="tracking-tight text-pink-500 cursor-pointer">
                                    To
                                    <span className="text-pink-600">mo</span>
                                    <span className="text-pink-700">mo</span>
                                    <span className="text-pink-800">ji</span>
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

                    <HeaderLinkComponent title="Go to news page" href="/news" text="News"
                        icon={<HeaderLinkNewsIcon />} />
                    <HeaderLinkComponent title="Go to review settings page" href="/visually-similar/review-settings" text="Start Reviews"
                        icon={<HeaderLinkReviewSettingsIcon />} />
                    <HeaderLinkComponent title="Browse by JLPT Level" href="/#browse-by-jlpt-level" text="Browse by JLPT Level"
                        icon={<HeaderLinkBrowseJlptIcon />} />

                    <div className="flex items-center">
                        <LoginButton />
                    </div>
                </div>
            </nav>

        </header>
    );
}

export default HeaderMain;