'use client'

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const QuizContext = createContext({})

export const QuizContextProvider = ({ children }) => {
    const [promptSet, setPromptSet] = useState([]);

    const [guessMeaningSelected, setGuessMeaningSelected] = useState(null);
    const [guessReadingSelected, setGuessReadingSelected] = useState(null);
    const [guessKanjiSelected, setGuessKanjiSelected] = useState(null);

    const [kanjiSetSelected, setKanjiSetSelected] = useState(null);
    const [vocabularySetSelected, setVocabularySetSelected] = useState(null);

    const [reviewMode, setReviewMode] = useState(false);
    const [practiceMode, setPracticeMode] = useState(false);
    const [reviewSet, setReviewSet] = useState([]);

    function loadInitialValue(localStorageKey, defaultvalue, setterCallback) {
        const storedValue = JSON.parse(localStorage.getItem(localStorageKey));
        setterCallback(storedValue !== null ? storedValue : defaultvalue);
    }

    useEffect(() => {
        loadInitialValue('guessMeaningSelected', true, setGuessMeaningSelected);
        loadInitialValue('guessReadingSelected', true, setGuessReadingSelected);
        loadInitialValue('guessKanjiSelected', false, setGuessKanjiSelected);
        loadInitialValue('kanjiSetSelected', true, setKanjiSetSelected);
        loadInitialValue('vocabularySetSelected', false, setVocabularySetSelected);
    }, [])

    useEffect(() => {
        localStorage.setItem('guessMeaningSelected', guessMeaningSelected)
    }, [guessMeaningSelected])
    useEffect(() => {
        localStorage.setItem('guessReadingSelected', guessReadingSelected)
    }, [guessReadingSelected])
    useEffect(() => {
        localStorage.setItem('guessKanjiSelected', guessKanjiSelected)
    }, [guessKanjiSelected])
    useEffect(() => {
        localStorage.setItem('kanjiSetSelected', kanjiSetSelected)
    }, [kanjiSetSelected])
    useEffect(() => {
        localStorage.setItem('vocabularySetSelected', vocabularySetSelected)
    }, [vocabularySetSelected])

    const providerValue = useMemo(() => ({
        promptSet, setPromptSet,

        guessMeaningSelected, setGuessMeaningSelected,
        guessReadingSelected, setGuessReadingSelected,
        guessKanjiSelected, setGuessKanjiSelected,

        kanjiSetSelected, setKanjiSetSelected,
        vocabularySetSelected, setVocabularySetSelected,

        reviewMode, setReviewMode,
        practiceMode, setPracticeMode,

        reviewSet, setReviewSet
    }), [promptSet, guessMeaningSelected, guessReadingSelected, guessKanjiSelected,
        kanjiSetSelected, vocabularySetSelected,
        reviewMode, practiceMode, reviewSet]);

    return (
        <QuizContext.Provider value={providerValue}>
            {children}
        </QuizContext.Provider>
    )
};

export const useQuizContext = () => useContext(QuizContext);