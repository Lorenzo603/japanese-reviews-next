'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { doesSessionExist, signOut } from "supertokens-auth-react/recipe/session";
import { useRouter } from 'next/navigation';
import Avatar from "boring-avatars";
import { useUserContext } from "@/app/context/userContext";
import SidebarLink from "./SidebarLink";
import SidebarNewsIcon from "./SidebarNewsIcon";
import SidebarReviewSettingsIcon from "./SidebarReviewSettingsIcon";
import SidebarBrowseJlptIcon from "./SidebarBrowseJlptIcon";

export const LoginSidebar = () => {

    const { username } = useUserContext();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();

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
        router.push('/');
    };

    return (
        <div>

            {isAuthenticated ? (

                <button className="flex items-center" onClick={toggleMenu}>
                    {username
                        ? <Avatar name={username} variant="beam" size={48} />
                        : <div className="bg-pink-50 rounded-full border-4 border-pink-300 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                    }
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
                    <h2 className="text-xl font-bold mb-2 text-pink-800">Browse</h2>
                    <nav aria-label="navigation-menu">
                        <ul>
                            <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                                <SidebarLink href="/news" title="News" icon={<SidebarNewsIcon />} onClick={toggleMenu} />
                            </li>
                            <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                                <SidebarLink href="/visually-similar/review-settings" title="Start Reviews" icon={<SidebarReviewSettingsIcon />} onClick={toggleMenu} />
                            </li>
                            <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                                <SidebarLink href="/#browse-by-jlpt-level" title="Browse By JLPT Level" icon={<SidebarBrowseJlptIcon />} onClick={toggleMenu} />
                            </li>
                            <div aria-hidden="false" className="w-full h-1 py-4"><hr className="block bg-rim w-full h-1" /></div>
                            {
                                isAuthenticated ? (
                                    <>
                                        <h2 className="text-xl font-bold mb-2 text-pink-800">Account</h2>
                                        <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                                            <Link href="/settings/account" className="w-full" onClick={toggleMenu}>
                                                <div className="flex flex-row gap-x-2 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                    Settings
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="flex py-2 hover:bg-pink-50 text-gray-800 hover:text-pink-600 transition-colors duration-20">
                                            <button onClick={handleSignOut} className="w-full">
                                                <div className="flex flex-row gap-x-2 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                                    </svg>
                                                    Sign Out
                                                </div>
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <Link className="flex line-clamp-1 items-center justify-center mt-2 gap-2 rounded-md 
                                bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                                hover:bg-pink-700 no-underline"
                                        href="/sign-in">Sign In</Link>
                                )
                            }

                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    );
};

export default LoginSidebar;
