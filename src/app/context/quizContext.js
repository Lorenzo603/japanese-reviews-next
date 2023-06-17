'use client'

import { createContext, useContext, useMemo, useState } from "react";

const QuizContext = createContext({})

export const QuizContextProvider = ({ children }) => {
    const [promptSet, setPromptSet] = useState([]);

    const [guessMeaningSelected, setGuessMeaningSelected] = useState(true);
    const [guessReadingSelected, setGuessReadingSelected] = useState(false);
    const [guessKanjiSelected, setGuessKanjiSelected] = useState(false);

    const [kanjiSetSelected, setKanjiSetSelected] = useState(true);
    const [vocabularySetSelected, setVocabularySetSelected] = useState(false);

    const [reviewMode, setReviewMode] = useState(false);
    const [reviewSet, setReviewSet] = useState([]);

    const providerValue = useMemo(() => ({
        promptSet, setPromptSet,

        guessMeaningSelected, setGuessMeaningSelected,
        guessReadingSelected, setGuessReadingSelected,
        guessKanjiSelected, setGuessKanjiSelected,

        kanjiSetSelected, setKanjiSetSelected,
        vocabularySetSelected, setVocabularySetSelected,
        
        reviewMode, setReviewMode,
        reviewSet, setReviewSet
    }), [promptSet, guessMeaningSelected, guessReadingSelected, guessKanjiSelected, kanjiSetSelected, vocabularySetSelected, reviewMode, reviewSet]);

    return (
        <QuizContext.Provider value={providerValue}>
            {children}
        </QuizContext.Provider>
    )
};

export const useQuizContext = () => useContext(QuizContext);