'use client'

import { createContext, useContext, useMemo, useState } from "react";

const ReviewSessionContext = createContext({})

export const ReviewSessionContextProvider = ({ children }) => {



    const [answerState, setAnswerState] = useState(AnswerState.WAITING_RESPONSE);

    const [totalAnswers, setTotalAnswers] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

    const providerValue = useMemo(() => ({
        answerState, setAnswerState,
        totalAnswers, setTotalAnswers,
        totalCorrect, setTotalCorrect

    }), [answerState, totalAnswers, totalCorrect]);

    return (
        <ReviewSessionContext.Provider value={providerValue}>
            {children}
        </ReviewSessionContext.Provider>
    )
};

export const AnswerState = {
    WAITING_RESPONSE: 0,
    ANSWERED: 1,
    FINISHED: 2,
};

export const useReviewSessionContext = () => useContext(ReviewSessionContext);

