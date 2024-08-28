'use client'

import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import { useRouter } from "next/navigation";

export default function VisuallySimilarReviewSettings() {

    const router = useRouter();

    const { setPromptSet, guessKanji, setGuessKanji, 
        guessMeaning, 
        multichoiceInput, setMultichoiceInput, 
        typingInput,
        quickMode, setQuickMode } = useVisuallySimilarQuizContext();

    const handleLevelNumberClick = async (selectedLevel) => {

        let promptSetResponse = await (await fetch('/api/visually-similar/quiz/prompts', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                selectedLevel: selectedLevel,
                guessKanji: guessKanji,
                guessMeaning: guessMeaning,
                multichoiceInput: multichoiceInput,
                typingInput: typingInput
            })
        })).json();

        console.log('promptSetResponse:', promptSetResponse);
        setPromptSet(promptSetResponse);

        router.push('/visually-similar/review');

    }


    return (
        <main>
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="max-w-2xl py-4">
                        <section>
                            <h1 className="text-2xl">Review Settings</h1>
                            <p>Try it now</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row">
                                    <div>
                                        Guess Kanji:
                                    </div>
                                    <div>
                                        <input type="checkbox" checked={guessKanji} onChange={() => setGuessKanji(!guessKanji)} />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div>
                                        Multichoice:
                                    </div>
                                    <div>
                                        <input type="checkbox" checked={multichoiceInput} onChange={() => setMultichoiceInput(!multichoiceInput)} />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div>
                                        Quick Mode:
                                    </div>
                                    <div>
                                        <input type="checkbox" checked={quickMode} onChange={() => setQuickMode(!quickMode)} />
                                    </div>
                                </div>

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