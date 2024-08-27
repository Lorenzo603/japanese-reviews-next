'use client'

import { useState } from "react";

export default function ReviewSettings() {

    const [guessKanji, setGuessKanji] = useState(true);
    const [guessMeaning, setGuessMeaning] = useState(false);

    const [multichoiceInput, setMultichoiceInput] = useState(true);
    const [typingInput, setTypingInput] = useState(false);

    const handleLevelNumberClick = (levelNumber) => {
        // gather kanji of selected level and start quiz
        
    }


    return (
        <main>
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="max-w-2xl py-4">
                        <section>
                            <h1 className="text-2xl">Review Settings</h1>
                            <p>Try it now</p>
                            <div>

                            </div>
                            <ol className='grid grid-cols-6 md:grid-cols-10 text-center gap-2'>
                                {Array.from({ length: 60 }, (_, i) => i + 1).map(index => {
                                    return (
                                        <li key={'level-number-' + index} >
                                            <button className='bg-pink-500 text-white rounded-md p-2 hover:bg-pink-600 w-full'
                                                onClick={() => handleLevelNumberClick(index)}>{index}</button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
