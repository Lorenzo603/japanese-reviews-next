'use client'

import { AnswerState, useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";
import ContinueModal from "@/app/components/modals/ContinueModal";
import Link from "next/link";
import StartReviewsButton from "./StartReviewsButton";
import SelectCategoryButton from "./SelectCategoryButton";
import ResumeBatchButton from "./ResumeBatchButton";

export default function VisuallySimilarReviewSettings() {

    const GUESS_MODE_SEGMENT_CONTROL_ID = "guess-mode-segment-control";
    const GUESS_MODE_KANJI_BUTTON_ID = "guess-mode-kanji";
    const GUESS_MODE_MEANING_BUTTON_ID = "guess-mode-meaning";
    const INPUT_METHOD_SEGMENT_CONTROL_ID = "input-method-segment-control";
    const INPUT_METHOD_MULTICHOICE_BUTTON_ID = "input-method-multichoice";
    const INPUT_METHOD_TYPING_BUTTON_ID = "input-method-typing";
    const SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME = "bg-transparent text-slate-600";
    const SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME = "bg-pink-500 text-slate-100 shadow";


    const { setPromptSet,
        setPromptIndex,
        guessKanji, setGuessKanji,
        multichoiceInput, setMultichoiceInput,
        quickMode, setQuickMode,
        setFocusModeEnabled,
        setAnswerState, setTotalAnswers, setTotalCorrect, setWrongAnswers,
    } = useVisuallySimilarQuizContext();

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [canResumeBatch, setCanResumeBatch] = useState(false);
    const [showContinueModal, setShowContinueModal] = useState(false);
    const [selectedReviewCategory, setSelectedReviewCategory] = useState('');

    const [isLoading, setIsLoading] = useState(false);


    const router = useRouter();

    useEffect(() => {
        setPromptSet([]);
        setPromptIndex(0);
        setTotalAnswers(0);
        setTotalCorrect(0);
        setAnswerState(AnswerState.WAITING_RESPONSE);
        setWrongAnswers([]);

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

        async function loadActivePromptSet() {
            const sessionExists = await doesSessionExist();
            if (sessionExists) {
                setIsAuthenticated(true);
                loadActivePrompSetFromDatabase();
            }
        }
        loadActivePromptSet();

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


    const loadActivePrompSetFromDatabase = async () => {

        try {
            const activePromptSetResponse = await fetch('/api/visually-similar/quiz/prompts', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!activePromptSetResponse.ok) {
                throw new Error(`HTTP error status: ${activePromptSetResponse.status}`);
            }

            const activePromptSetResponseJson = await activePromptSetResponse.json();
            if (activePromptSetResponseJson
                && activePromptSetResponseJson.hasOwnProperty('prompts')
                && activePromptSetResponseJson.prompts.length > 0) {
                setPromptSet(activePromptSetResponseJson.prompts);
                setCanResumeBatch(true);
            }

            return activePromptSetResponseJson;
        } catch (error) {
            console.error('Error loading active prompt set:', error);
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

    const handleStartReviewsClick = async (overwriteBatchConfirmed) => {
        if (selectedReviewCategory === '') {
            return;
        }
        if (canResumeBatch && !overwriteBatchConfirmed) {
            setShowContinueModal(true);
            return;
        }
        let promptSetResponse = await (await fetch('/api/visually-similar/quiz/prompts', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                selectedReviewCategory: selectedReviewCategory,
                guessKanji: guessKanji,
                multichoiceInput: multichoiceInput,
            })
        })).json();

        console.log('promptSetResponse:', promptSetResponse);

        setPromptSet(promptSetResponse);

        setIsLoading(true);
        router.push('/visually-similar/review');
    }

    const resumeBatch = async () => {
        try {
            const activePromptSetResponse = await fetch('/api/visually-similar/quiz/prompts', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!activePromptSetResponse.ok) {
                throw new Error(`HTTP error status: ${activePromptSetResponse.status}`);
            }

            const activePromptSetResponseJson = await activePromptSetResponse.json();
            if (activePromptSetResponseJson
                && activePromptSetResponseJson.hasOwnProperty('prompts')
                && activePromptSetResponseJson.prompts.length > 0) {
                setPromptSet(activePromptSetResponseJson.prompts);
                setGuessKanji(activePromptSetResponseJson.guessKanji);
                setMultichoiceInput(activePromptSetResponseJson.multichoiceInput);
                setTotalAnswers(activePromptSetResponseJson.totalAnswers);
                setTotalCorrect(activePromptSetResponseJson.totalCorrect);
                setWrongAnswers(activePromptSetResponseJson.wrongAnswers);

                setPromptIndex(activePromptSetResponseJson.totalAnswers);

            }

            router.push('/visually-similar/review');
        } catch (error) {
            console.error('Error loading active prompt set:', error);
            return null;
        }
    }


    return (
        <main>
            <div className="w-full">
                <ContinueModal show={showContinueModal} onOk={() => handleStartReviewsClick(true)} onCancel={() => setShowContinueModal(false)}
                    title="Resume Batch" description="You will overwrite the unfinished review batch. Do you want to continue?"
                    okText="Yes, continue!" cancelText="Cancel" />
                <div className="mx-auto max-w-7xl p-6">
                    <div className="max-w-2xl py-4">
                        {
                            canResumeBatch ? (
                                <section>
                                    <div className="pb-6">
                                        <h1 className="sr-only">Resume Batch</h1>
                                        <p className="text-sm py-2">You have an unfinished review batch, you can continue from where you left off:</p>
                                        <ResumeBatchButton resumeBatch={resumeBatch} />
                                    </div>
                                </section>

                            ) : !isAuthenticated &&
                            <section>
                                <p className="text-sm py-2">
                                    Remember to <Link href="/sign-in" className="underline font-bold text-md text-blue-900">sign in</Link> if you want to have the possibility to resume your latest unfinished review batch.
                                </p>
                            </section>


                        }
                        <section>
                            <h1 className="text-2xl">Review Settings</h1>
                            <div className="flex flex-col">
                                <div className="flex flex-row">
                                    <div className="flex flex-col py-4">
                                        <div className="py-2">
                                            Select <span className="font-bold">Guess Mode</span>:
                                        </div>
                                        <div id={GUESS_MODE_SEGMENT_CONTROL_ID}
                                            className="inline-flex items-baseline justify-start border border-gray-400 bg-slate-50 max-w-64">
                                            <button id={GUESS_MODE_KANJI_BUTTON_ID} type="button" aria-disabled="false" onClick={() => handleGuessModeSegmentControlClick(GUESS_MODE_KANJI_BUTTON_ID)}
                                                className={`group inline-flex items-center justify-center whitespace-nowrap p-6 align-middle font-semibold 
                                                    transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] 
                                                    gap-1.5 text-sm disabled:stroke-slate-400 disabled:text-slate-400 
                                                    h-7 w-full ${guessKanji ? SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME : SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME}`}>
                                                <span>Guess Kanji</span>
                                            </button>
                                            <button id={GUESS_MODE_MEANING_BUTTON_ID} type="button" aria-disabled="false" onClick={() => handleGuessModeSegmentControlClick(GUESS_MODE_MEANING_BUTTON_ID)}
                                                className={`group inline-flex items-center justify-center whitespace-nowrap p-6 align-middle font-semibold 
                                                    transition-all duration-300 ease-in-out disabled:cursor-not-allowed stroke-blue-700 min-w-[32px] 
                                                    gap-1.5 text-sm disabled:stroke-slate-400 disabled:text-slate-400 
                                                    h-7 w-full ${guessKanji ? SELECT_CONTROL_INACTIVE_TAB_CLASS_NAME : SELECT_CONTROL_ACTIVE_TAB_CLASS_NAME}`}>
                                                <span>Guess Meaning</span>
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            <ul className="text-sm list-disc list-inside">
                                                <li><span className="font-bold">Guess Kanji</span>: guess the correct Kanji based on a Meaning prompt</li>
                                                <li><span className="font-bold">Guess Meaning</span>: guess the correct Meaning based on a Kanji prompt</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="flex flex-row">
                                    <div className="flex flex-col py-4">
                                        <div className="py-2">
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
                                </div> */}
                                <div className="flex flex-col pt-4 pb-8">
                                    <div className="flex flex-row items-center">
                                        <div className="pr-4">
                                            Enable <span className="font-bold">Quick Mode</span>:
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
                                    <div className="text-sm mt-2">Immediately move to the next prompt upon answering</div>
                                </div>

                            </div>
                            <div>
                                <p>Select a difficulty level or category: the kanjis belonging to that category will be used in the review batch</p>
                                <ul>
                                    <li>
                                        <SelectCategoryButton categoryName='Level 1' isSelected={selectedReviewCategory === 'category-level-1'}
                                            handleSelectCategoryClick={() => setSelectedReviewCategory('category-level-1')} />
                                    </li>
                                </ul>
                            </div>
                            <ol className='grid grid-cols-6 md:grid-cols-10 text-center gap-2'>
                                {Array.from({ length: 60 }, (_, i) => i + 1).map(index => {
                                    return (
                                        <li key={`level-number-${index}`} >
                                            <SelectCategoryButton categoryName={index} isSelected={selectedReviewCategory === `level-number-${index}`}
                                                handleSelectCategoryClick={() => setSelectedReviewCategory(`level-number-${index}`)} />
                                        </li>
                                    );
                                })}
                            </ol>
                            <div>
                                <StartReviewsButton handleStartReviewsClick={handleStartReviewsClick} isLoading={isLoading} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}

