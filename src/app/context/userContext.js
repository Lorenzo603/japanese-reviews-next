'use client'

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {

    const [username, setUsername] = useState('');

    useEffect(() => {
        async function loadAccountSettings() {
            const sessionExists = await doesSessionExist();
            if (sessionExists) {
                const accountSettings = await loadAccountSettingsFromDatabase();
                if (accountSettings) {
                    setUsername(accountSettings.username);
                }
            }
        }
        loadAccountSettings();

    }, []);


    const loadAccountSettingsFromDatabase = async () => {
        try {
            const response = await fetch('/api/visually-similar/settings/account', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }

            const resJson = await response.json();
            // console.log('Account Settings from DB:', resJson);
            return resJson;
        } catch (error) {
            console.error('Error loading user settings:', error);
            return null;
        }
    }


    const providerValue = useMemo(() => ({
        username, setUsername,
    }), [
        username,
    ]);

    return (
        <UserContext.Provider value={providerValue}>
            {children}
        </UserContext.Provider>
    )
};

export const useUserContext = () => useContext(UserContext);