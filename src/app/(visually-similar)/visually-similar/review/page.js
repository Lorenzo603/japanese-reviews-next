'use client'

import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import { useState } from "react";

export default function VisuallySimilarReview() {

    const { promptSet, multichoiceInput, typingInput } = useVisuallySimilarQuizContext();

    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [currentPrompt, setCurrentPrompt] = useState(promptSet[currentPromptIndex]);

    const handleUserAnswer = async (answer) => {
        if (answer === currentPrompt["correctAnswer"]) {
            console.log("Correct answer!");
        } else {
            console.log("Wrong answer");
        }
        if (currentPromptIndex < promptSet.length - 1) {
            setCurrentPromptIndex(currentPromptIndex + 1);
            setCurrentPrompt(promptSet[currentPromptIndex + 1]);
        }
    } 

    return (
        <main>
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="max-w-2xl py-4">
                        <section>
                            <div className="text-2xl">{currentPrompt["prompt"]}</div>
                            <div>
                                {
                                    currentPrompt["answers"].map(answer => {
                                        return <div key={answer}>
                                            <button className='bg-red-500 text-white rounded-md p-2 hover:bg-red-600 w-full'
                                                onClick={() => handleUserAnswer(answer)}>
                                                <span className="japanese-font">{answer}</span>
                                            </button>
                                        </div>
                                    })
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
