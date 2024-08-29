'use client'

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const VisuallySimilarQuizContext = createContext({})

export const VisuallySimilarQuizContextProvider = ({ children }) => {
    const [promptSet, setPromptSet] = useState([]);

    const [guessKanji, setGuessKanji] = useState(true);

    const [multichoiceInput, setMultichoiceInput] = useState(true);

    // Go directly to next question upon clicking without seeing the success/wrong result
    const [quickMode, setQuickMode] = useState(false);


    function loadInitialValue(localStorageKey, defaultvalue, setterCallback) {
        const storedValue = JSON.parse(localStorage.getItem(localStorageKey));
        setterCallback(storedValue !== null ? storedValue : defaultvalue);
    }

    useEffect(() => {
        loadInitialValue('guessKanji', true, setGuessKanji);
        loadInitialValue('multichoiceInput', true, setMultichoiceInput);
        loadInitialValue('quickMode', false, setQuickMode);
    }, [])

    useEffect(() => {
        localStorage.setItem('guessKanji', guessKanji)
    }, [guessKanji])
    useEffect(() => {
        localStorage.setItem('multichoiceInput', multichoiceInput)
    }, [multichoiceInput])
    useEffect(() => {
        localStorage.setItem('quickMode', quickMode)
    }, [quickMode])

    const providerValue = useMemo(() => ({
        promptSet, setPromptSet,

        guessKanji, setGuessKanji,
        multichoiceInput, setMultichoiceInput,
        quickMode, setQuickMode
        
    }), [promptSet, guessKanji, multichoiceInput, quickMode]);

    return (
        <VisuallySimilarQuizContext.Provider value={providerValue}>
            {children}
        </VisuallySimilarQuizContext.Provider>
    )
};

export const useVisuallySimilarQuizContext = () => useContext(VisuallySimilarQuizContext);