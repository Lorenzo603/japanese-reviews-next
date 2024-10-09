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
import CategoryIcon from "./CategoryIcon";

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
    const [selectedReviewCategories, setSelectedReviewCategories] = useState([]);
    const [numSelectedReviews, setNumSelectedReviews] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const categories = [
        {
            id: "category-level-1", name: "Level 1", numItems: 8,
            icon: <CategoryIcon url="/img/reviews/categories/category-level-1.svg" />,
        },
        {
            id: "category-level-2", name: "Level 2", numItems: 10,
            icon: <CategoryIcon url="/img/reviews/categories/category-level-2.svg" />,
        },
        {
            id: "category-level-3", name: "Level 3", numItems: 11,
            icon: <CategoryIcon url="/img/reviews/categories/category-level-3.svg" />,
        },
        {
            id: "category-level-4", name: "Level 4", numItems: 10,
            icon: <CategoryIcon url="/img/reviews/categories/category-level-4.svg" />,
        },
        {
            id: "category-level-5", name: "Level 5", numItems: 10,
            icon: <CategoryIcon url="/img/reviews/categories/category-level-5.svg" />,
        },
        {
            id: "category-level-6", name: "Level 6", numItems: 6,
            icon: <CategoryIcon url="/img/reviews/categories/category-level-6.svg" />,
        },
        {
            id: "jlpt5", name: "JLPT N5", numItems: 55,
            icon: <CategoryIcon url="/img/medals/medal-bronze.svg" />,
        },
        {
            id: "jlpt4", name: "JLPT N4", numItems: 110,
            icon: <CategoryIcon url="/img/medals/medal-silver.svg" />,
        },
        {
            id: "jlpt3", name: "JLPT N3", numItems: 222,
            icon: <CategoryIcon url="/img/medals/medal-gold.svg" />,
        },
        {
            id: "jlpt2", name: "JLPT N2", numItems: 225,
            icon: <CategoryIcon url="/img/medals/medal-platinum.svg" />,
        },
        {
            id: "numbers", name: "Numbers", numItems: 6,
            icon: <CategoryIcon url="/img/reviews/categories/numbers.svg" />,
        },
        {
            id: "colors", name: "Colors", numItems: 6,
            icon: <CategoryIcon url="/img/reviews/categories/colors.svg" />,
        },
        {
            id: "directions", name: "Directions", numItems: 9,
            icon: <CategoryIcon url="/img/reviews/categories/directions.svg" />,
        },
        {
            id: "places", name: "Places", numItems: 10,
            icon: <CategoryIcon url="/img/reviews/categories/places.svg" />,
        },
        {
            id: "animals", name: "Animals", numItems: 8,
            icon: <CategoryIcon url="/img/reviews/categories/animals.svg" />,
        },
        {
            id: "foods", name: "Food & Drink", numItems: 6,
            icon: <CategoryIcon url="/img/reviews/categories/foods.svg" />,
        },
        {
            id: "body", name: "Body Parts", numItems: 10,
            icon: <CategoryIcon url="/img/reviews/categories/body.svg" />,
        },
        {
            id: "family", name: "Family", numItems: 8,
            icon: <CategoryIcon url="/img/reviews/categories/family.svg" />,
        },
        {
            id: "seasons", name: "Seasons", numItems: 2,
            icon: <CategoryIcon url="/img/reviews/categories/seasons.svg" />,
        },
        {
            id: "weather", name: "Weather", numItems: 3,
            icon: <CategoryIcon url="/img/reviews/categories/weather.svg" />,
        },
        {
            id: "periods-of-time", name: "Periods of Time", numItems: 5,
            icon: <CategoryIcon url="/img/reviews/categories/periods-of-time.svg" />,
        },
    ];

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

    const toggleSelectedCategory = (categoryId) => {
        if (selectedReviewCategories.includes(categoryId)) {
            setSelectedReviewCategories(selectedReviewCategories.filter((c) => c !== categoryId));
        } else {
            setSelectedReviewCategories([...selectedReviewCategories, categoryId]);
        }
    }

    useEffect(() => {
        setNumSelectedReviews(
            categories
                .filter((c) => selectedReviewCategories.includes(c.id))
                .map((c) => c.numItems)
                .reduce((a, b) => a + b, 0)
        )
    }, [selectedReviewCategories])

    const handleStartReviewsClick = async (overwriteBatchConfirmed) => {
        if (selectedReviewCategories.length === 0) {
            return;
        }
        if (canResumeBatch && !overwriteBatchConfirmed) {
            setShowContinueModal(true);
            return;
        }

        setIsLoading(true);

        let promptSetResponse = await (await fetch('/api/visually-similar/quiz/prompts', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                selectedReviewCategories: selectedReviewCategories,
                guessKanji: guessKanji,
                multichoiceInput: multichoiceInput,
            })
        })).json();

        console.log('promptSetResponse:', promptSetResponse);

        setPromptSet(promptSetResponse);

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
                    okText="Yes, continue!" cancelText="Cancel" isLoading={isLoading} />
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
                                <div className="flex flex-row py-4">
                                    <div className="flex flex-col p-4 w-full 
                                        rounded-md border-2 border-slate-300 shadow">
                                        <div className="pb-2">
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
                                <div className="flex flex-row py-4">
                                    <div className="flex flex-col p-4 w-full  
                                    rounded-md border-2 border-slate-300 shadow">
                                        <div className="flex flex-col p-x-4">
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
                                            <div className="flex text-sm mt-2">Immediately move to the next prompt upon answering</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-row flex-wrap mt-4 mb-4">
                                <section>
                                    <h1 className="sr-only">Select Review Category</h1>
                                    <p className="py-2">Select a <span className="font-bold">difficulty level</span> or <span className="font-bold">category</span>: the kanjis belonging to that category will be used in the review batch</p>
                                    <div className="flex flex-col mb-2">
                                        <section>
                                            <h2 className="font-bold text-lg py-2">Difficulty Level:</h2>
                                            <ul className="grid grid-cols-3 md:grid-cols-6 text-center gap-2">
                                                {Array.from(categories)
                                                    .filter((category) => category.id.startsWith('category-level-'))
                                                    .map(category => {
                                                        return (
                                                            <li key={category.id} >
                                                                <SelectCategoryButton categoryName={category.name} isSelected={selectedReviewCategories.includes(category.id)}
                                                                    handleSelectCategoryClick={() => toggleSelectedCategory(category.id)}
                                                                    numItems={category.numItems} icon={category.icon} />
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                        </section>
                                    </div>
                                    <div className="flex flex-col mb-2">
                                        <section>
                                            <h2 className="font-bold text-lg py-2">JLPT Categories:</h2>
                                            <ul className="grid grid-cols-3 md:grid-cols-5 text-center gap-2">
                                                {
                                                    Array.from(categories)
                                                        .filter((category) => category.id.startsWith('jlpt'))
                                                        .map(category => {
                                                            return (
                                                                <li key={category.id} >
                                                                    <SelectCategoryButton categoryName={category.name} isSelected={selectedReviewCategories.includes(category.id)}
                                                                        handleSelectCategoryClick={() => toggleSelectedCategory(category.id)}
                                                                        numItems={category.numItems} icon={category.icon} />
                                                                </li>
                                                            );
                                                        })
                                                }
                                                <li key="jlpt1" >
                                                    <button className={`
                                                        bg-gray-300 border border-gray-400 
                                                        text-white rounded-md p-2 w-full h-full
                                                        flex justify-center items-center
                                                        cursor-default
                                                        `}
                                                        onClick={() => { }}>
                                                        {`JLPT N1 (Coming Soon!)`}
                                                    </button>
                                                </li>
                                            </ul>
                                        </section>
                                    </div>
                                    <div className="flex flex-col mb-2">
                                        <section>
                                            <h2 className="font-bold text-lg py-2">Assorted Categories:</h2>
                                            <ul className="grid grid-cols-3 md:grid-cols-5 text-center gap-2">
                                                {
                                                    Array.from(categories)
                                                        .filter((category) => !category.id.startsWith('category-level-') && !category.id.startsWith('jlpt'))
                                                        .map(category => {
                                                            return (
                                                                <li key={category.id} >
                                                                    <SelectCategoryButton categoryName={category.name} isSelected={selectedReviewCategories.includes(category.id)}
                                                                        handleSelectCategoryClick={() => toggleSelectedCategory(category.id)}
                                                                        numItems={category.numItems} icon={category.icon} />
                                                                </li>
                                                            );
                                                        })
                                                }

                                            </ul>
                                        </section>
                                    </div>
                                </section>
                            </div>
                            {/* <ol className='grid grid-cols-6 md:grid-cols-10 text-center gap-2 mb-4'>
                                {Array.from({ length: 60 }, (_, i) => i + 1).map(index => {
                                    return (
                                        <li key={`level-number-${index}`} >
                                            <SelectCategoryButton categoryName={index} isSelected={selectedReviewCategories.includes(`level-number-${index}`)}
                                                handleSelectCategoryClick={() => toggleSelectedCategory(`level-number-${index}`)} />
                                        </li>
                                    );
                                })}
                            </ol> */}
                            <div>Total number of reviews: {numSelectedReviews}</div>
                            <div className="flex justify-center">
                                <StartReviewsButton isActive={selectedReviewCategories.length > 0} isLoading={isLoading}
                                    handleStartReviewsClick={handleStartReviewsClick} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}

