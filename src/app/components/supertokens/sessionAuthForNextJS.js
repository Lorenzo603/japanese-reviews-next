"use client";

import React, { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";


export const SessionAuthForNextJS = (props) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setLoaded(true)
    }, [])
    if (!loaded) {
        return props.children;
    }
    return <SessionAuth {...props}>{props.children}</SessionAuth>;
};