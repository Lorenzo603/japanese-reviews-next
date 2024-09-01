'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { doesSessionExist, signOut } from "supertokens-auth-react/recipe/session";

export const LoginButton = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const sessionExists = await doesSessionExist();
            setIsAuthenticated(sessionExists);
        }

        checkAuth();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignOut = async () => {
        await signOut();
        setIsAuthenticated(false);
        setIsMenuOpen(false);
    };

    return (
        <div>

            {isAuthenticated ? (
                <button onClick={toggleMenu}>
                    <div className="bg-pink-50 rounded-full border-4 border-pink-300 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                </button>
            ) : (
                <div>
                    <button onClick={toggleMenu} className="flex sm:hidden bg-pink-500 text-slate-50 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <Link className="hidden sm:flex line-clamp-1 items-center justify-center gap-2 rounded-md 
                                bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                                hover:bg-pink-700 no-underline"
                        href="/sign-in">Sign In</Link>
                </div>
            )}


            {/* Overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={toggleMenu}></div>

            {/* Sidebar Menu */}
            <div className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 w-64 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-4 flex flex-col h-full">
                    <button onClick={toggleMenu} className="self-end text-pink-600 hover:text-pink-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold mb-4 text-pink-800">Account</h2>
                    <ul>
                        <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                            <Link href="/#search" className="w-full" onClick={toggleMenu}>
                                <div className="flex flex-row gap-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                    Search
                                </div>
                            </Link>
                        </li>
                        <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                            <Link href="/visually-similar/review-settings" className="w-full" onClick={toggleMenu}>
                                <div className="flex flex-row gap-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                    </svg>
                                    Start Reviews
                                </div>
                            </Link>
                        </li>
                        <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                            <Link href="/#browse-by-jlpt-level" className="w-full" onClick={toggleMenu}>
                                <div className="flex flex-row gap-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                    </svg>
                                    Browse By JLPT Level
                                </div>
                            </Link>
                        </li>
                        <div aria-hidden="false" className="w-full h-1 py-4"><hr className="block bg-rim w-full h-1" /></div>
                        {
                            isAuthenticated ? (
                                <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                                    <button onClick={handleSignOut} className="w-full">
                                        <div className="flex flex-row gap-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                            </svg>
                                            Sign Out
                                        </div>
                                    </button>
                                </li>
                            ) : (
                                <Link className="flex line-clamp-1 items-center justify-center mt-2 gap-2 rounded-md 
                                bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                                hover:bg-pink-700 no-underline"
                                    href="/sign-in">Sign In</Link>
                            )
                        }

                    </ul>
                </div>
            </div>

        </div>
    );
};

export default LoginButton;
