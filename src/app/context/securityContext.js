'use client'

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { usePathname, redirect } from 'next/navigation';
import { getSession } from '../../services/SessionService';
import { getCookie } from 'cookies-next';

const SecurityContext = createContext({})

export const SecurityContextProvider = ({ children }) => {

    const pathname = usePathname();

    const PUBLIC_PATHS = ['/login'];

    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        authCheck(pathname);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function authCheck(url) {
        setAuthorized(false);
        const path = url.split('?')[0];
        
        if (!PUBLIC_PATHS.includes(path)) {
            const sessionId = getCookie('sessionId');
            console.log('cookie sessionId:', sessionId);
            const session = getSession(sessionId);
            if (session === undefined) {
                redirect('/login');
            }

        }

        setAuthorized(true);

    }

    const providerValue = useMemo(() => ({
        authorized, setAuthorized
    }), [authorized]);

    return (
        authorized &&
        <SecurityContext.Provider value={providerValue}>
            {children}
        </SecurityContext.Provider>
    )
};

export const useSecurityContext = () => useContext(SecurityContext);