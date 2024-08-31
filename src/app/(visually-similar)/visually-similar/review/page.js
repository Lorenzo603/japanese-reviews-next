'use client'

import { AnswerState, useReviewSessionContext } from "@/app/context/reviewSessionContext";
import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Confetti from 'react-dom-confetti';

export default function VisuallySimilarReview() {

    const { promptSet, guessKanji, multichoiceInput, quickMode, focusModeEnabled } = useVisuallySimilarQuizContext();
    const { answerState, setAnswerState,
        totalAnswers, setTotalAnswers,
        totalCorrect, setTotalCorrect } = useReviewSessionContext();

    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [currentPrompt, setCurrentPrompt] = useState(promptSet[currentPromptIndex]);

    const [wrongAnswers] = useState([]);

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
            if (answer === currentPrompt["correctAnswer"]) {
                console.log("Correct answer!");
                setTotalCorrect(totalCorrect + 1);
                const correctAnswerItem = document.getElementById(`answer-button-${idx}`);
                colorItemCorrect(correctAnswerItem);
            } else {
                console.log("Wrong answer");
                wrongAnswers.push(currentPrompt);
                const answersListItem = document.getElementById("answers-list");
                for (let i = 0; i < answersListItem.children.length; i++) {
                    const answerItem = answersListItem.children[i].children[0];
                    if (answerItem.id === `answer-button-${idx}`) {
                        colorItemWrong(answerItem);
                    }
                    if (answerItem.children[0].innerText === currentPrompt["correctAnswer"]) {
                        colorItemCorrect(answerItem);
                    }
                }
            }
            if (quickMode) {
                moveToNextPrompt();
                return;
            }
        }

    }

    function colorItemCorrect(item) {
        item.classList.remove("bg-slate-50", "text-black", "border-pink-400", "hover:bg-pink-400", "hover:text-white");
        item.classList.add("bg-green-500", "text-white", "border-green-700");
    }

    function colorItemWrong(item) {
        item.classList.remove("bg-slate-50", "text-black", "border-pink-400", "hover:bg-pink-400", "hover:text-white");
        item.classList.add("bg-red-500", "text-white", "border-red-700");
    }

    function colorItemNeutral(item) {
        item.classList.remove("bg-green-500", "text-white", "border-green-700");
        item.classList.remove("bg-red-500", "text-white", "border-red-700");
        item.classList.add("bg-slate-50", "text-black", "border-pink-400", "hover:bg-pink-400", "hover:text-white");
    }


    const moveToNextPrompt = () => {
        if (currentPromptIndex < promptSet.length - 1) {
            const answersListItem = document.getElementById("answers-list");
            for (let i = 0; i < answersListItem.children.length; i++) {
                const answerItem = answersListItem.children[i].children[0];
                colorItemNeutral(answerItem);
            }
            setAnswerState(AnswerState.WAITING_RESPONSE);
            setCurrentPromptIndex(currentPromptIndex + 1);
            setCurrentPrompt(promptSet[currentPromptIndex + 1]);
        } else {
            setAnswerState(AnswerState.FINISHED);
            if (totalCorrect === totalReviews) {
                setIsExploding(true);
            }
        }
    }

    function getCorrectPercentage() {
        return Math.round(totalCorrect / totalReviews * 100)
    }

    function getCongratulationsStatement() {
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
                                                        <button id={`answer-button-${idx}`}
                                                            className='
                                                    w-full bg-slate-50 text-black 
                                                    p-2 
                                                    rounded-md
                                                    border-2 border-pink-400 
                                                    hover:bg-pink-400 hover:text-white'
                                                            onClick={() => handleUserAnswer(answer, idx)}>
                                                            <span className={`${guessKanji ? "japanese-font text-4xl" : "text-2xl"}`}>{answer}</span>
                                                        </button>
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
