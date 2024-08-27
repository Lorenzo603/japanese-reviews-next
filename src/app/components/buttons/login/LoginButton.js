'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { doesSessionExist, signOut } from "supertokens-auth-react/recipe/session";

export const LoginButton = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const sessionExists = await doesSessionExist();
            setIsAuthenticated(sessionExists);
        }

        checkAuth();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setIsAuthenticated(false);
    };

    return (
        <div>
            {isAuthenticated ? (
                <button onClick={handleSignOut}>
                    <div className="bg-pink-50 rounded-full border-4 border-pink-300 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                </button>
            ) : (
                <Link className="line-clamp-1 flex items-center justify-center gap-2 rounded-md 
                    bg-pink-500 px-3.5 py-2.5 text-center text-base font-bold text-white shadow-sm 
                    hover:bg-pink-700 no-underline"
                    href="/sign-in">Sign In</Link>
            )}
        </div>
    );
};

export default LoginButton;