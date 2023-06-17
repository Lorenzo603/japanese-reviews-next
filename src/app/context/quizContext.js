'use client'

import { createContext, useContext, useMemo, useState } from "react";

const QuizContext = createContext({})

export const QuizContextProvider = ({ children }) => {
    const [promptSet, setPromptSet] = useState([]);
    const [reviewMode, setReviewMode] = useState(false);
    const providerValue = useMemo(() => ({
        promptSet, setPromptSet,
        reviewMode, setReviewMode,
    }), [promptSet, reviewMode]);

    return (
        <QuizContext.Provider value={providerValue}>
            {children}
        </QuizContext.Provider>
    )
};

export const useQuizContext = () => useContext(QuizContext);