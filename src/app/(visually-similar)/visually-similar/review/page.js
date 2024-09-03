'use client'

import { AnswerState, useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Confetti from 'react-dom-confetti';
import AnswerButton from "./AnswerButton";

export default function VisuallySimilarReview() {

    const NEUTRAL_COLOR_CLASSES = "bg-slate-50 text-black border-pink-400 hover:bg-pink-400 hover:text-white";
    const CORRECT_COLOR_CLASSES = "bg-green-500 text-white border-green-700";
    const WRONG_COLOR_CLASSES = "bg-red-500 text-white border-red-700";

    const { promptSet, promptIndex, setPromptIndex,
        guessKanji, quickMode, focusModeEnabled,
        answerState, setAnswerState,
        totalAnswers, setTotalAnswers,
        totalCorrect, setTotalCorrect,
        wrongAnswers, setWrongAnswers,
    } = useVisuallySimilarQuizContext();
    
    const [currentPrompt, setCurrentPrompt] = useState(promptSet[promptIndex]);
    
    const [clickedButtonIdx, setClickedButtonIdx] = useState(null);
    
    const totalReviews = promptSet.length;

    const handleKeyDownCallback = useCallback(handleKeyDown, [answerState]);

    function handleKeyDown(e) {
        e.preventDefault();

        if (answerState === AnswerState.ANSWERED && (e.key === ' ' || e.key === 'ArrowRight')) {
            moveToNextPrompt();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDownCallback);

        return function cleanup() {
            window.removeEventListener('keydown', handleKeyDownCallback);
        }

    }, [handleKeyDownCallback]);


    const handleUserAnswer = async (answer, idx) => {
        if (answerState === AnswerState.WAITING_RESPONSE) {
            setAnswerState(AnswerState.ANSWERED);
            setTotalAnswers(totalAnswers + 1);
            setClickedButtonIdx(idx);
            if (answer === currentPrompt["correctAnswer"]) {
                console.log("Correct answer!");
                setTotalCorrect(totalCorrect + 1);
            } else {
                console.log("Wrong answer");
                setWrongAnswers([...wrongAnswers, currentPrompt]);
            }
            if (quickMode) {
                moveToNextPrompt();
                return;
            }
        }

    }

    const moveToNextPrompt = () => {
        if (promptIndex < promptSet.length - 1) {
            setAnswerState(AnswerState.WAITING_RESPONSE);
            setPromptIndex(promptIndex + 1);
            setCurrentPrompt(promptSet[promptIndex + 1]);
        } else {
            setAnswerState(AnswerState.FINISHED);
            if (totalCorrect === totalReviews) {
                setIsExploding(true);
            }
        }
    }

    
    function getCurrentColor(answerIdx) {
        const correctAnswerIdx = currentPrompt["answers"].indexOf(currentPrompt["correctAnswer"]);
        if (answerState === AnswerState.ANSWERED) {
            if (answerIdx === correctAnswerIdx) {
                return CORRECT_COLOR_CLASSES;
            } else {
                if (answerIdx === clickedButtonIdx) {
                    return WRONG_COLOR_CLASSES;
                }
                return NEUTRAL_COLOR_CLASSES;
            }
        }
        return NEUTRAL_COLOR_CLASSES;
    }

    function getCorrectPercentage() {
        return Math.round(totalCorrect / totalReviews * 100)
    }

    function getCongratulationsStatement() {
        if (totalAnswers === 0) {
            return "No worries!"
        }
        const correctPercentage = getCorrectPercentage();
        if (correctPercentage === 100) {
            return "Absolutely perfect!"
        } else if (correctPercentage >= 80) {
            return "Amazing work!"
        } else if (correctPercentage >= 60) {
            return "Well done!"
        } else if (correctPercentage >= 40) {
            return "Nice try!"
        } else {
            return "Great effort!"
        }
    }

    function getCongratulationsSubStatement() {
        const correctPercentage = getCorrectPercentage();
        if (totalAnswers === 0) {
            return "When you're ready, dive in!"
        }
        if (correctPercentage === 100) {
            return "You aced it! You're a true quiz master. Keep shining!"
        } else if (correctPercentage >= 80) {
            return "You're nearly flawless. Keep it up, and you'll achieve perfection!"
        } else if (correctPercentage >= 60) {
            return "You're making real strides. Keep up the good work!"
        } else if (correctPercentage >= 40) {
            return "You're getting there. A bit more practice, and you'll be unstoppable!"
        } else {
            return "Every step forward is progress. Keep going, you'll improve in no time!"
        }
    }

    const [isExploding, setIsExploding] = useState(false);
    const confettiConfig = {
        angle: '280',
        spread: '360',
        startVelocity: 30,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 4000,
        stagger: 3,
        width: '12px',
        height: '12px',
        perspective: '500px',
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    };



    return (
        <main className="h-full flex-grow">
            <div className="h-full flex-grow overflow-hidden">
                <div className="w-full p-1 flex justify-center">
                    <Confetti active={isExploding} config={confettiConfig} />
                </div>
                <section>
                    <div className="mx-auto max-w-7xl flex justify-center p-6">
                        <div className="flex flex-col flex-grow justify-center text-center max-w-2xl py-4">
                            {
                                answerState === AnswerState.FINISHED ? (
                                    <div>
                                        <div className="flex flex-col pb-4">
                                            <div className="text-4xl pb-2">
                                                {getCongratulationsStatement()}
                                            </div>
                                            <div className="text-xl pb-4 italic">
                                                {getCongratulationsSubStatement()}
                                            </div>
                                        </div>
                                        <div className="text-2xl pb-2">
                                            {`You got ${totalCorrect} out of ${totalReviews}`}
                                        </div>
                                        <div className="text-2xl">
                                            {getCorrectPercentage()}&#37; correct
                                        </div>
                                        {
                                            wrongAnswers.length > 0 &&
                                            <div className="pt-4">
                                                <div className="text-xl">
                                                    Incorrect answers
                                                </div>
                                                <ul>
                                                    {wrongAnswers.map(wrongAnswer =>
                                                        <li key={wrongAnswer['prompt']}>
                                                            <span className={guessKanji ? "" : "japanese-font"}>{wrongAnswer['prompt']}</span>
                                                            &nbsp;:&nbsp;
                                                            <span className={guessKanji ? "japanese-font" : ""}>{wrongAnswer['correctAnswer']}</span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        }
                                        <div className="p-10">
                                            <Link href="/visually-similar/review-settings"
                                                className="bg-pink-500 hover:bg-pink-400 
                                                text-white p-4 rounded"
                                            >
                                                Go Back
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-4xl pb-6">
                                            <span className={guessKanji ? "" : "japanese-font"}>{currentPrompt["prompt"]}</span>
                                        </div>
                                        <ul id="answers-list" className="flex flex-col gap-4">
                                            {
                                                currentPrompt["answers"].map((answer, idx) => {
                                                    return <li key={idx}>
                                                        <AnswerButton answer={answer}
                                                            correctAnswer={currentPrompt["correctAnswer"]}
                                                            answerState={answerState}
                                                            guessKanji={guessKanji}
                                                            handleUserAnswer={() => handleUserAnswer(answer, idx)}
                                                            colorClass={getCurrentColor(idx)} />
                                                    </li>
                                                })
                                            }
                                        </ul>
                                        {
                                            !quickMode &&
                                            <div className="flex flex-col items-center p-10">
                                                <button
                                                    className='
                                                    w-20
                                                    bg-pink-500 text-white 
                                                    p-2 
                                                    rounded-md
                                                    border-2 border-pink-700 
                                                    hover:bg-pink-700 hover:text-white'
                                                    onClick={() => moveToNextPrompt()}>
                                                    Next&nbsp;&gt;
                                                </button>
                                                {
                                                    !focusModeEnabled &&
                                                    <div className="italic p-2">
                                                        Hint: press space to hit next
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
