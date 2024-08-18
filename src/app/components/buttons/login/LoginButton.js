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
        <>
            {isAuthenticated ? (
                <button onClick={handleSignOut}>Sign Out</button>
            ) : (
                <button>Sign In / Register</button>
            )}
        </>
    );
};

export default LoginButton;