'use client'

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const VisuallySimilarQuizContext = createContext({})

export const AnswerState = {
    WAITING_RESPONSE: 0,
    ANSWERED: 1,
    FINISHED: 2,
};

export const VisuallySimilarQuizContextProvider = ({ children }) => {
    const [isReady, setIsReady] = useState(false);

    const [promptSet, setPromptSet] = useState([]);
    const [promptIndex, setPromptIndex] = useState(0);

    const [guessKanji, setGuessKanji] = useState(null);
    const [multichoiceInput, setMultichoiceInput] = useState(null);

    // Go directly to next question upon clicking without seeing the success/wrong result
    const [quickMode, setQuickMode] = useState(null);

    const [focusModeEnabled, setFocusModeEnabled] = useState(null);

    const [answerState, setAnswerState] = useState(AnswerState.WAITING_RESPONSE);
    const [totalAnswers, setTotalAnswers] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);

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
        loadInitialValue('promptSet', [], setPromptSet);
        loadInitialValue('promptIndex', 0, setPromptIndex);

        loadInitialValue('guessKanji', true, setGuessKanji);
        loadInitialValue('multichoiceInput', true, setMultichoiceInput);
        loadInitialValue('quickMode', false, setQuickMode);
        loadInitialValue('focusModeEnabled', false, setFocusModeEnabled);

        loadInitialValue('answerState', AnswerState.WAITING_RESPONSE, setAnswerState);
        loadInitialValue('totalAnswers', 0, setTotalAnswers);
        loadInitialValue('totalCorrect', 0, setTotalCorrect);
        loadInitialValue('wrongAnswers', [], setWrongAnswers);

        setIsReady(true);
    }, [])

    useEffect(() => {
        if (isReady) {
            localStorage.setItem('promptSet', JSON.stringify(promptSet))
        }
    }, [promptSet])
    useEffect(() => {
        if (isReady) {
            localStorage.setItem('promptIndex', promptIndex)
        }
    }, [promptIndex])
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

    useEffect(() => {
        if (isReady) {
            localStorage.setItem('answerState', answerState)
        }
    }, [answerState])
    useEffect(() => {
        if (isReady) {
            localStorage.setItem('totalAnswers', totalAnswers)
        }
    }, [totalAnswers])
    useEffect(() => {
        if (isReady) {
            localStorage.setItem('totalCorrect', totalCorrect)
        }
    }, [totalCorrect])
    useEffect(() => {
        if (isReady) {
            localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers))
        }
    }, [wrongAnswers])

    const providerValue = useMemo(() => ({
        promptSet, setPromptSet,
        promptIndex, setPromptIndex,

        guessKanji, setGuessKanji,
        multichoiceInput, setMultichoiceInput,
        quickMode, setQuickMode,
        focusModeEnabled, setFocusModeEnabled,
        answerState, setAnswerState,
        totalAnswers, setTotalAnswers,
        totalCorrect, setTotalCorrect,
        wrongAnswers, setWrongAnswers,

    }), [
        promptSet, promptIndex, 
        guessKanji, multichoiceInput, quickMode, focusModeEnabled,
        answerState, totalAnswers, totalCorrect, wrongAnswers,
    ]);

    return (
        <VisuallySimilarQuizContext.Provider value={providerValue}>
            {isReady ? children : null}
        </VisuallySimilarQuizContext.Provider>
    )
};

export const useVisuallySimilarQuizContext = () => useContext(VisuallySimilarQuizContext);