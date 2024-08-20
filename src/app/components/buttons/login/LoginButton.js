'use client'

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
                <button
                    className="p-3 bg-pink-500 
                    hover:bg-pink-300 hover:text-pink-600 rounded">
                    Sign In
                </button>
            )}
        </div>
    );
};

export default LoginButton;