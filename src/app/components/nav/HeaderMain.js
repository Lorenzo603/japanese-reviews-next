'use client'

import { useState } from "react";
import LoginButton from "../buttons/login/LoginButton";
import { usePathname } from "next/navigation";
import HeaderLinkComponent from "./HeaderLinkComponent";
import HeaderLinkNewsIcon from "./HeaderLinkNewsIcon";
import HeaderLinkReviewSettingsIcon from "./HeaderLinkReviewSettingsIcon";
import HeaderLinkBrowseJlptIcon from "./HeaderLinkBrowseJlptIcon";
import Logo from "./Logo";
import SearchBarComponent from "../search/SearchBarComponent";
import HeaderSearchIcon from "./HeaderSearchIcon";

const HeaderMain = () => {
    const [isSearchBarVisible, setSearchBarVisible] = useState(false);
    const pathname = usePathname();

    const toggleSearchBar = () => {
        setSearchBarVisible(!isSearchBarVisible);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav aria-label="navigation-menu" className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6">
                <Logo />
                <div className="flex items-center justify-end gap-x-4">

                    {
                        pathname !== '/' &&
                        <div className="flex items-center">
                            <button
                                title="Toggle search bar"
                                className="no-underline font-bold text-blue-900 hidden sm:flex items-center rounded-md gap-x-2 px-2 py-2.5 hover:bg-slate-50"
                                onClick={toggleSearchBar}
                            >
                                <HeaderSearchIcon />
                                <span className="hidden lg:inline">Search</span>
                            </button>
                        </div>
                    }

                    {isSearchBarVisible && (
                        <div className="absolute top-24 left-0 w-full flex justify-center
                            bg-gradient-to-b from-sky-100 to-slate-50
                            shadow-md">
                            <SearchBarComponent />
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
                        <LoginButton />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderMain;
