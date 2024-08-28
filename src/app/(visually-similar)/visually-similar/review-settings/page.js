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


    const inactiveTabClassName = "bg-transparent";
    const activeTabClassName = "rounded-md bg-white shadow";

    const handleSegmentControlClick = (buttonId) => {
        const buttons = document.getElementById("vis-sim-guess-mode-segment-control").children;
        // Remove active styles from all buttons
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove(...activeTabClassName.split(/\s+/));
            buttons[i].classList.add(...inactiveTabClassName.split(/\s+/));
        };

        const button = document.getElementById(buttonId);
        // Set the selected button as active
        button.classList.add(...activeTabClassName.split(/\s+/));
        button.classList.remove(...inactiveTabClassName.split(/\s+/));
    }

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
                            <div className="flex flex-col">
                                <div className="flex flex-row">
                                    <div>
                                        Guess Mode:
                                    </div>
                                    <div id="vis-sim-guess-mode-segment-control" className="inline-flex h-9 w-full items-baseline justify-start rounded-lg bg-gray-100 p-1 sm:w-auto">
                                        <button id="guess-mode-kanji" type="button" aria-disabled="false" onClick={() => handleSegmentControlClick("guess-mode-kanji")}
                                            className="group inline-flex items-center justify-center whitespace-nowrap py-2 align-middle font-semibold transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] gap-1.5 text-xs disabled:stroke-slate-400 disabled:text-slate-400 hover:stroke-blue-950 hover:text-blue-950 h-7 text-slate-950 w-full rounded-md bg-white px-3 drop-shadow sm:w-auto">
                                            <span>Guess Kanji</span>
                                        </button>
                                        <button id="guess-mode-meaning" type="button" aria-disabled="false" onClick={() => handleSegmentControlClick("guess-mode-meaning")}
                                            className="group inline-flex items-center justify-center whitespace-nowrap rounded-lg py-2 align-middle font-semibold transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] gap-1.5 text-xs disabled:stroke-slate-400 disabled:text-slate-400 hover:stroke-blue-950 hover:text-blue-950 h-7 w-full bg-transparent px-3 text-slate-600 sm:w-auto">
                                            <span>Guess Meaning</span>
                                        </button>
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
                                        Enable Quick Mode:
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center justify-center">
                                            <label className="font-medium transition-colors duration-300 ease-in-out peer-disabled:opacity-70 text-xs flex items-center">
                                                <div className="relative">
                                                    <input role="switch" id="switch-1" className="peer sr-only" aria-label="Checked" aria-checked="true" type="checkbox" onChange={() => setQuickMode(!quickMode)} name="switch" />
                                                    <div
                                                        className="block cursor-pointer rounded-full border border-slate-300 bg-slate-50 transition duration-300 peer-checked:border-blue-700 peer-checked:bg-blue-700 peer-disabled:cursor-not-allowed peer-disabled:border-slate-100 peer-disabled:bg-slate-100 h-6 w-12">
                                                    </div>
                                                    <div
                                                        className="absolute top-0.5 z-10 cursor-pointer rounded-full border border-slate-50 bg-blue-700 transition duration-300 peer-checked:translate-x-5 peer-checked:border-blue-700 peer-checked:bg-white peer-disabled:cursor-not-allowed peer-disabled:border-slate-100 peer-disabled:bg-slate-400 left-[3px] size-5 peer-checked:left-[5px]">
                                                    </div>
                                                </div>
                                                <span className="ml-2 cursor-pointer whitespace-nowrap text-xs font-medium leading-none text-black">Checked</span>
                                            </label>
                                        </div>
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
