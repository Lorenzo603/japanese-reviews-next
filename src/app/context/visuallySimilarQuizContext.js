'use client'

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const VisuallySimilarQuizContext = createContext({})

export const VisuallySimilarQuizContextProvider = ({ children }) => {
    const [promptSet, setPromptSet] = useState([]);

    const [guessKanji, setGuessKanji] = useState(true);
    const [guessMeaning, setGuessMeaning] = useState(false);

    const [multichoiceInput, setMultichoiceInput] = useState(true);
    const [typingInput, setTypingInput] = useState(false);


    function loadInitialValue(localStorageKey, defaultvalue, setterCallback) {
        const storedValue = JSON.parse(localStorage.getItem(localStorageKey));
        setterCallback(storedValue !== null ? storedValue : defaultvalue);
    }

    useEffect(() => {
        loadInitialValue('guessKanji', true, setGuessKanji);
        loadInitialValue('guessMeaning', false, setGuessMeaning);
        loadInitialValue('multichoiceInput', true, setMultichoiceInput);
        loadInitialValue('typingInput', false, setTypingInput);
    }, [])

    useEffect(() => {
        localStorage.setItem('guessKanji', guessKanji)
    }, [guessKanji])
    useEffect(() => {
        localStorage.setItem('guessMeaning', guessMeaning)
    }, [guessMeaning])
    useEffect(() => {
        localStorage.setItem('multichoiceInput', multichoiceInput)
    }, [multichoiceInput])
    useEffect(() => {
        localStorage.setItem('typingInput', typingInput)
    }, [typingInput])

    const providerValue = useMemo(() => ({
        promptSet, setPromptSet,

        guessKanji, setGuessKanji,
        guessMeaning, setGuessMeaning,
        multichoiceInput, setMultichoiceInput,
        typingInput, setTypingInput
        
    }), [promptSet, guessKanji, guessMeaning, multichoiceInput, typingInput]);

    return (
        <VisuallySimilarQuizContext.Provider value={providerValue}>
            {children}
        </VisuallySimilarQuizContext.Provider>
    )
};

export const useVisuallySimilarQuizContext = () => useContext(VisuallySimilarQuizContext);