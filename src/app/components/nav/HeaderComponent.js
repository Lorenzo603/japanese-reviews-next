import Link from "next/link";
import LoginButton from "../buttons/login/LoginButton";

const HeaderComponent = () => {
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
                <div className="flex flex-1 items-center justify-end gap-x-6">
                    <div>
                        <Link
                            className="no-underline 
                            font-bold text-md text-blue-900
                            items-baseline 
                            hidden sm:inline"
                            href="/#browse-by-jlpt-level">
                            Browse by JLPT level
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <LoginButton />
                    </div>
                </div>
            </nav>

        </header>
    );
}

export default HeaderComponent;