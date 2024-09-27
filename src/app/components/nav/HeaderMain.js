'use client'

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LoginSidebar } from "./sidebar/LoginSidebar";
import HeaderLinkComponent from "./HeaderLinkComponent";
import HeaderLinkNewsIcon from "./HeaderLinkNewsIcon";
import HeaderLinkReviewSettingsIcon from "./HeaderLinkReviewSettingsIcon";
import HeaderLinkBrowseJlptIcon from "./HeaderLinkBrowseJlptIcon";
import Logo from "./Logo";
import SearchBarComponent from "../search/SearchBarComponent";
import HeaderSearchIcon from "./HeaderSearchIcon";

const HeaderMain = () => {
    const [isSearchBarVisible, setSearchBarVisible] = useState(false);
    const searchBarRef = useRef(null);
    const pathname = usePathname();

    const toggleSearchBar = () => {
        setSearchBarVisible((prev) => !prev);
    };

    // Close search bar if user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setSearchBarVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchBarVisible]);

    // Close search bar when the route changes (because pathname changes)
    useEffect(() => {
        setSearchBarVisible(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav aria-label="navigation-menu" className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6">
                <Logo />
                <div className="flex items-center justify-end gap-x-1 sm:gap-x-4">

                    {pathname !== '/' && (
                        <div className="flex items-center">
                            <button
                                title="Toggle search bar"
                                className="no-underline font-bold text-blue-900 flex items-center rounded-md gap-x-2 px-2 py-2.5 hover:bg-slate-50"
                                onClick={toggleSearchBar}
                            >
                                <HeaderSearchIcon />
                                <span className="hidden lg:inline">Search</span>
                            </button>
                        </div>
                    )}

                    {isSearchBarVisible && (
                        <div
                            ref={searchBarRef} // Attach ref to search bar container
                            className="absolute top-24 left-0 shadow-md
                                w-full flex justify-center items-center
                                bg-gradient-to-b from-sky-100 to-slate-50"
                        >
                            <SearchBarComponent />

                            <button
                                className="absolute right-4 top-10 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                onClick={() => setSearchBarVisible(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <HeaderLinkComponent
                        title="Go to news page"
                        href="/news"
                        text="News"
                        icon={<HeaderLinkNewsIcon />}
                    />
                    <HeaderLinkComponent
                        title="Go to review settings page"
                        href="/visually-similar/review-settings"
                        text="Start Reviews"
                        icon={<HeaderLinkReviewSettingsIcon />}
                    />
                    <HeaderLinkComponent
                        title="Browse by JLPT Level"
                        href="/#browse-by-jlpt-level"
                        text="Browse by JLPT Level"
                        icon={<HeaderLinkBrowseJlptIcon />}
                    />

                    <div className="flex items-center">
                        <LoginSidebar />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderMain;
