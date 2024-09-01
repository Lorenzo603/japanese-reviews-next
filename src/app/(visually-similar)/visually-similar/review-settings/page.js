'use client'

import { AnswerState, useReviewSessionContext } from "@/app/context/reviewSessionContext";
import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

export default function VisuallySimilarReviewSettings() {

    const GUESS_MODE_SEGMENT_CONTROL_ID = "guess-mode-segment-control";
    const GUESS_MODE_KANJI_BUTTON_ID = "guess-mode-kanji";
    const GUESS_MODE_MEANING_BUTTON_ID = "guess-mode-meaning";
    const INPUT_METHOD_SEGMENT_CONTROL_ID = "input-method-segment-control";
    const INPUT_METHOD_MULTICHOICE_BUTTON_ID = "input-method-multichoice";
    const INPUT_METHOD_TYPING_BUTTON_ID = "input-method-typing";
    const SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME = "bg-transparent text-slate-600";
    const SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME = "bg-pink-500 text-slate-100 shadow";


    const { setPromptSet, guessKanji, setGuessKanji,
        multichoiceInput, setMultichoiceInput,
        quickMode, setQuickMode,
        setFocusModeEnabled,
     } = useVisuallySimilarQuizContext();

    const { setAnswerState, setTotalAnswers, setTotalCorrect } = useReviewSessionContext();

    const router = useRouter();

    useEffect(() => {
        setTotalAnswers(0);
        setTotalCorrect(0);
        setAnswerState(AnswerState.WAITING_RESPONSE);

        async function loadUserSettings() {
            const sessionExists = await doesSessionExist();
            if (sessionExists) {
                const userSettings = await loadUserSettingsFromDatabase();
                if (userSettings) {
                    setGuessKanji(userSettings.guessKanji);
                    setMultichoiceInput(userSettings.multichoiceInput);
                    setQuickMode(userSettings.quickMode);
                    setFocusModeEnabled(userSettings.focusModeEnabled);
                }
            }
        }
        loadUserSettings();
    }, []);

    const loadUserSettingsFromDatabase = async () => {
        try {
            const response = await fetch('/api/visually-similar/user/settings', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }

            const resJson = await response.json();
            // console.log('User Settings from DB:', resJson);
            return resJson;
        } catch (error) {
            console.error('Error loading user settings:', error);
            return null;
        }
    }

    const handleGuessModeSegmentControlClick = async (buttonId) => {
        setGuessKanji(buttonId === GUESS_MODE_KANJI_BUTTON_ID);

        const sessionExists = await doesSessionExist();
        if (sessionExists) {
            await fetch('/api/visually-similar/user/settings', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    guessKanji: buttonId === GUESS_MODE_KANJI_BUTTON_ID,
                })
            })
        }
    }

    const handleInputMethodSegmentControlClick = async (buttonId) => {
        setMultichoiceInput(buttonId === INPUT_METHOD_MULTICHOICE_BUTTON_ID);

        const sessionExists = await doesSessionExist();
        if (sessionExists) {
            await fetch('/api/visually-similar/user/settings', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    multichoiceInput: buttonId === INPUT_METHOD_MULTICHOICE_BUTTON_ID,
                })
            })
        }
    }

    const toggleQuickMode = async () => {
        setQuickMode(!quickMode);
        const sessionExists = await doesSessionExist();
        if (sessionExists) {
            await fetch('/api/visually-similar/user/settings', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quickMode: !quickMode,
                })
            })
        }
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
                multichoiceInput: multichoiceInput,
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
                                    <div className="flex flex-col py-4">
                                        <div className="p-2">
                                            Guess Mode:
                                        </div>
                                        <div id={GUESS_MODE_SEGMENT_CONTROL_ID}
                                            className="inline-flex w-full items-baseline justify-start border border-gray-400 bg-slate-50 sm:w-auto">
                                            <button id={GUESS_MODE_KANJI_BUTTON_ID} type="button" aria-disabled="false" onClick={() => handleGuessModeSegmentControlClick(GUESS_MODE_KANJI_BUTTON_ID)}
                                                className={`group inline-flex items-center justify-center whitespace-nowrap p-6 align-middle font-semibold 
                                                    transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] 
                                                    gap-1.5 text-sm disabled:stroke-slate-400 disabled:text-slate-400 
                                                    h-7 w-full sm:w-auto ${guessKanji ? SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME : SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME}`}>
                                                <span>Guess Kanji</span>
                                            </button>
                                            <button id={GUESS_MODE_MEANING_BUTTON_ID} type="button" aria-disabled="false" onClick={() => handleGuessModeSegmentControlClick(GUESS_MODE_MEANING_BUTTON_ID)}
                                                className={`group inline-flex items-center justify-center whitespace-nowrap p-6 align-middle font-semibold 
                                                    transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] 
                                                    gap-1.5 text-sm disabled:stroke-slate-400 disabled:text-slate-400 
                                                    h-7 w-full sm:w-auto ${guessKanji ? SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME : SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME}`}>
                                                <span>Guess Meaning</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-col py-4">
                                        <div className="p-2">
                                            Input Method:
                                        </div>
                                        <div id={INPUT_METHOD_SEGMENT_CONTROL_ID}
                                            className="inline-flex w-full items-baseline justify-start border border-gray-400 bg-slate-50 sm:w-auto">
                                            <button id={INPUT_METHOD_MULTICHOICE_BUTTON_ID} type="button" aria-disabled="false" onClick={() => handleInputMethodSegmentControlClick(INPUT_METHOD_MULTICHOICE_BUTTON_ID)}
                                                className={`group inline-flex items-center justify-center whitespace-nowrap p-6 align-middle font-semibold 
                                                    transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] 
                                                    gap-1.5 text-sm disabled:stroke-slate-400 disabled:text-slate-400 
                                                    h-7 w-full sm:w-auto ${multichoiceInput ? SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME : SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME}`}>
                                                <span>Multichoice</span>
                                            </button>
                                            <button id={INPUT_METHOD_TYPING_BUTTON_ID} type="button" aria-disabled="false" onClick={() => handleInputMethodSegmentControlClick(INPUT_METHOD_TYPING_BUTTON_ID)}
                                                className={`group inline-flex items-center justify-center whitespace-nowrap p-6 align-middle font-semibold 
                                                    transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] 
                                                    gap-1.5 text-sm disabled:stroke-slate-400 disabled:text-slate-400 
                                                    h-7 w-full sm:w-auto ${multichoiceInput ? SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME : SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME}`}>
                                                <span>Typing</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center pt-6 pb-8">
                                    <div className="pr-4">
                                        Enable Quick Mode:
                                    </div>
                                    <div className="inline-flex items-center justify-center">
                                        <label className="font-medium transition-colors duration-300 ease-in-out peer-disabled:opacity-70 text-xs flex items-center">
                                            <div className="relative">
                                                <input role="switch" id="switch-1" className="peer sr-only" aria-label="Checked" aria-checked="true"
                                                    checked={quickMode ? 'checked' : ''}
                                                    type="checkbox" onChange={() => toggleQuickMode()} name="switch" />
                                                <div
                                                    className="block cursor-pointer rounded-full 
                                                        border border-slate-300 bg-slate-50 
                                                        transition duration-300 
                                                        peer-checked:border-pink-500 peer-checked:bg-pink-500 
                                                        peer-disabled:cursor-not-allowed peer-disabled:border-slate-100 peer-disabled:bg-slate-100 h-6 w-12">
                                                </div>
                                                <div
                                                    className="absolute top-0.5 z-10 cursor-pointer rounded-full border border-slate-50 
                                                        bg-pink-500 transition duration-300 
                                                        peer-checked:translate-x-5 peer-checked:border-pink-500 peer-checked:bg-white 
                                                        peer-disabled:cursor-not-allowed peer-disabled:border-slate-100 peer-disabled:bg-slate-400 
                                                        left-[3px] size-5 peer-checked:left-[5px]">
                                                </div>
                                            </div>
                                            {/* <span className="ml-2 cursor-pointer whitespace-nowrap text-xs font-medium leading-none text-black">Checked</span> */}
                                        </label>
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

