'use client'

import { createContext, useContext, useMemo, useState } from "react";
import GuessMode from "../GuessMode";

const QuizContext = createContext({})

export const QuizContextProvider = ({ children }) => {
    const [kanjiSet, setKanjiSet] = useState([]);
    const [guessMode, setGuessMode] = useState(GuessMode.GUESS_MEANING);
    const [reviewMode, setReviewMode] = useState(false);
    const providerValue = useMemo(() => ({
        kanjiSet, setKanjiSet,
        guessMode, setGuessMode,
        reviewMode, setReviewMode,
    }), [kanjiSet, guessMode, reviewMode]);

    return (
        <QuizContext.Provider value={providerValue}>
            {children}
        </QuizContext.Provider>
    )
};

export const useQuizContext = () => useContext(QuizContext);