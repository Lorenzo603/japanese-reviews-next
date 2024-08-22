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
                <button onClick={handleSignOut}>Sign Out</button>
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