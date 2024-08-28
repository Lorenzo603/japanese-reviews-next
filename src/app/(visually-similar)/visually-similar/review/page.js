'use client'

import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import { useState } from "react";

export default function VisuallySimilarReview() {

    const AnswerState = {
        WAITING_RESPONSE: 0,
        ANSWERED: 1,
        FINISHED: 2,
    };

    const { promptSet, guessKanji, multichoiceInput, typingInput, quickMode } = useVisuallySimilarQuizContext();

    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [currentPrompt, setCurrentPrompt] = useState(promptSet[currentPromptIndex]);

    const [answerState, setAnswerState] = useState(AnswerState.WAITING_RESPONSE);

    const handleUserAnswer = async (answer, idx) => {
        if (answerState === AnswerState.WAITING_RESPONSE) {
            setAnswerState(AnswerState.ANSWERED);

            if (answer === currentPrompt["correctAnswer"]) {
                console.log("Correct answer!");
                const correctAnswerItem = document.getElementById(`answer-button-${idx}`);
                colorItemCorrect(correctAnswerItem);
            } else {
                console.log("Wrong answer");
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
        } else {

            moveToNextPrompt();

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
        }
    }

    return (
        <main>
            <div className="w-full">
                <div className="w-full bg-pink-100 h-2">
                    <div className="bg-red-600 h-2" style={{ width: '45%' }}></div>
                </div>

                <section>
                    <div className="mx-auto max-w-7xl p-6">
                        <div className="flex flex-col justify-center text-center max-w-2xl py-4">
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
                                                <span className={`${guessKanji ? "japanese-font" : ""} text-4xl`}>{answer}</span>
                                            </button>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
