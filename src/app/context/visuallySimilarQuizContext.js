'use client'

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const VisuallySimilarQuizContext = createContext({})

export const VisuallySimilarQuizContextProvider = ({ children }) => {
    const [isReady, setIsReady] = useState(false);

    const [promptSet, setPromptSet] = useState([]);

    const [guessKanji, setGuessKanji] = useState(null);
    const [multichoiceInput, setMultichoiceInput] = useState(null);

    // Go directly to next question upon clicking without seeing the success/wrong result
    const [quickMode, setQuickMode] = useState(null);

    const [focusModeEnabled, setFocusModeEnabled] = useState(null);

    function loadInitialValue(localStorageKey, defaultvalue, setterCallback) {
        const storedValue = localStorage.getItem(localStorageKey);
        // if (localStorageKey === 'multichoiceInput') {
        //     console.log('multichoiceInput storedValue:', storedValue)
        // }
        const storedValueJson = storedValue !== undefined && storedValue !== 'undefined' ? JSON.parse(storedValue) : null;
        // if (localStorageKey === 'multichoiceInput') {
        //     console.log('multichoiceInput localstorage:', storedValueJson)
        // }
        setterCallback(storedValueJson !== null ? storedValueJson : defaultvalue);
    }

    useEffect(() => {
        loadInitialValue('guessKanji', true, setGuessKanji);
        loadInitialValue('multichoiceInput', true, setMultichoiceInput);
        loadInitialValue('quickMode', false, setQuickMode);
        loadInitialValue('focusModeEnabled', false, setFocusModeEnabled);

        setIsReady(true);
    }, [])

    useEffect(() => {
        if (isReady) {
            localStorage.setItem('guessKanji', guessKanji)
        }
    }, [guessKanji])
    useEffect(() => {
        if (isReady) {
            localStorage.setItem('multichoiceInput', multichoiceInput)
        }
    }, [multichoiceInput])
    useEffect(() => {
        if (isReady) {
            localStorage.setItem('quickMode', quickMode)
        }
    }, [quickMode])
    useEffect(() => {
        if (isReady) {
            localStorage.setItem('focusModeEnabled', focusModeEnabled)
        }
    }, [focusModeEnabled])

    const providerValue = useMemo(() => ({
        promptSet, setPromptSet,

        guessKanji, setGuessKanji,
        multichoiceInput, setMultichoiceInput,
        quickMode, setQuickMode,
        focusModeEnabled, setFocusModeEnabled

    }), [promptSet, guessKanji, multichoiceInput, quickMode, focusModeEnabled]);

    return (
        <VisuallySimilarQuizContext.Provider value={providerValue}>
            {isReady ? children : null}
        </VisuallySimilarQuizContext.Provider>
    )
};

export const useVisuallySimilarQuizContext = () => useContext(VisuallySimilarQuizContext);