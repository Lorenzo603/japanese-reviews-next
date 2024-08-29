'use client'

import { createContext, useContext, useMemo, useState } from "react";

const ReviewSessionContext = createContext({})

export const ReviewSessionContextProvider = ({ children }) => {

    const [totalAnswers, setTotalAnswers] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

    const providerValue = useMemo(() => ({
        totalAnswers, setTotalAnswers,
        totalCorrect, setTotalCorrect

    }), [totalAnswers, totalCorrect]);

    return (
        <ReviewSessionContext.Provider value={providerValue}>
            {children}
        </ReviewSessionContext.Provider>
    )
};

export const useReviewSessionContext = () => useContext(ReviewSessionContext);