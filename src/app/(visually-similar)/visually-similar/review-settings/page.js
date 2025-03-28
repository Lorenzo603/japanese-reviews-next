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

	const [activeTab, setActiveTab] = useState('tab1');

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

		{ id: "materials-objects", name: "Materials & Objects", numItems: 85 },
		{ id: "nature-elements", name: "Nature & Elements", numItems: 73 },
		{ id: "action-verbs", name: "Action Verbs", numItems: 69 },
		{ id: "places-locations", name: "Places & Locations", numItems: 37, icon: <CategoryIcon url="/img/reviews/categories/places.svg" /> },
		{ id: "body-parts", name: "Body Parts", numItems: 22, icon: <CategoryIcon url="/img/reviews/categories/body.svg" /> },
		{ id: "people-family-relationships", name: "People, Family & Relationships", numItems: 31, icon: <CategoryIcon url="/img/reviews/categories/family.svg" /> },
		{ id: "basic-adjectives-descriptions", name: "Basic Adjectives & Descriptions", numItems: 40 },
		{ id: "animals", name: "Animals", numItems: 22, icon: <CategoryIcon url="/img/reviews/categories/animals.svg" /> },
		{ id: "emotion-feelings", name: "Emotion & Feelings", numItems: 37 },
		{ id: "food-drink", name: "Food & Drink", numItems: 18, icon: <CategoryIcon url="/img/reviews/categories/foods.svg" /> },
		{ id: "time-periods", name: "Time & Periods", numItems: 16, icon: <CategoryIcon url="/img/reviews/categories/periods-of-time.svg" /> },
		{ id: "plants-agriculture", name: "Plants & Agriculture", numItems: 28 },
		{ id: "buildings-structures", name: "Buildings & Structures", numItems: 24 },
		{ id: "society-government", name: "Society & Government", numItems: 23 },
		{ id: "directions-positions", name: "Directions & Positions", numItems: 14, icon: <CategoryIcon url="/img/reviews/categories/directions.svg" /> },
		{ id: "arts-literature", name: "Arts & Literature", numItems: 19 },
		{ id: "work-professions", name: "Work & Professions", numItems: 19 },
		{ id: "military-conflict", name: "Military & Conflict", numItems: 17 },
		{ id: "weather-seasons", name: "Weather & Seasons", numItems: 7, icon: <CategoryIcon url="/img/reviews/categories/weather.svg" /> },
		{ id: "communications-language", name: "Communications & Language", numItems: 16 },
		{ id: "numbers", name: "Numbers", numItems: 6, icon: <CategoryIcon url="/img/reviews/categories/numbers.svg" /> },
		{ id: "colors", name: "Colors", numItems: 6, icon: <CategoryIcon url="/img/reviews/categories/colors.svg" /> },
		{ id: "health-medicine", name: "Health & Medicine", numItems: 13 },
		{ id: "business-economy", name: "Business & Economy", numItems: 13 },
		{ id: "measurements-amounts", name: "Measurements & Amounts", numItems: 12 },
		{ id: "science-knowledge", name: "Science & Knowledge", numItems: 11 },
		{ id: "transportation-travel", name: "Transportation & Travel", numItems: 10 },
		{ id: "clothing-fashion", name: "Clothing & Fashion", numItems: 10 },
		{ id: "music-sound", name: "Music & Sound", numItems: 9 },
		{ id: "beliefs-religion", name: "Beliefs & Religion", numItems: 9 },
		{ id: "law-justice", name: "Law & Justice", numItems: 9 },
		{ id: "light-darkness", name: "Light & Darkness", numItems: 6 },
		{ id: "mythology-supernatural", name: "Mythology & Supernatural", numItems: 6 },
		{ id: "hobbies-leisure", name: "Mythology & Supernatural", numItems: 5 },
		{ id: "commerce-trade", name: "Mythology & Supernatural", numItems: 3 },
		{ id: "shapes-geometry", name: "Mythology & Supernatural", numItems: 3 },

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

	const handleTabClick = (tabId) => {
		setActiveTab(tabId);
		setSelectedReviewCategories([]);
	};

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
									<p className="py-2">Select a <span className="font-bold">difficulty level</span> or <span className="font-bold">category</span>: the kanjis belonging to that category will be used in the review batch</p>
									<div className="border-b border-gray-200">
										<nav className="flex gap-x-1 sm:gap-x-4" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
											<button type="button" className={`${activeTab === 'tab1' ? 'font-semibold border-pink-800 text-pink-800' : ''} py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-pink-800 focus:outline-none focus:text-pink-800 disabled:opacity-50 disabled:pointer-events-none`}
												id="tabs-with-badges-item-1" data-hs-tab="#tabs-with-badges-1" onClick={() => handleTabClick('tab1')}
												aria-controls="tabs-with-badges-1" role="tab" aria-selected={activeTab === 'tab1'}>
												Difficulty Levels <span className={`${activeTab === 'tab1' ? 'bg-pink-200 text-pink-800' : 'bg-gray-100 text-gray-800'} ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium`}>6</span>
											</button>
											<button type="button" className={`${activeTab === 'tab2' ? 'font-semibold border-pink-800 text-pink-800' : ''} py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-pink-800 focus:outline-none focus:text-pink-800 disabled:opacity-50 disabled:pointer-events-none`}
												id="tabs-with-badges-item-2" data-hs-tab="#tabs-with-badges-2" onClick={() => handleTabClick('tab2')}
												aria-controls="tabs-with-badges-2" role="tab" aria-selected={activeTab === 'tab2'}>
												JLPT Levels <span className={`${activeTab === 'tab2' ? 'bg-pink-200 text-pink-800' : 'bg-gray-100 text-gray-800'} ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium`}>4</span>
											</button>
											<button type="button" className={`${activeTab === 'tab3' ? 'font-semibold border-pink-800 text-pink-800' : ''} py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-pink-800 focus:outline-none focus:text-pink-800 disabled:opacity-50 disabled:pointer-events-none`}
												id="tabs-with-badges-item-3" data-hs-tab="#tabs-with-badges-3" onClick={() => handleTabClick('tab3')}
												aria-controls="tabs-with-badges-3" role="tab" aria-selected={activeTab === 'tab3'}>
												Life Categories <span className={`${activeTab === 'tab3' ? 'bg-pink-200 text-pink-800' : 'bg-gray-100 text-gray-800'} ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium`}>11</span>
											</button>
										</nav>
									</div>

									<div className="mt-3">

										<div id="tabs-with-badges-1" role="tabpanel" aria-labelledby="tabs-with-badges-item-1" aria-hidden={activeTab !== 'tab1'}>
											{activeTab === 'tab1' &&
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
											}
										</div>
										<div id="tabs-with-badges-2" role="tabpanel" aria-labelledby="tabs-with-badges-item-2" aria-hidden={activeTab !== 'tab2'}>
											{activeTab === 'tab2' &&
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
														<button className="
                                                        bg-gray-300 border border-gray-400 
                                                        text-white rounded-md p-2 w-full h-full
                                                        flex justify-center items-center"
															onClick={() => { }} disabled>
															{`JLPT N1 (Coming Soon!)`}
														</button>
													</li>
												</ul>
											}
										</div>
										<div id="tabs-with-badges-3" role="tabpanel" aria-labelledby="tabs-with-badges-item-3" aria-hidden={activeTab !== 'tab3'}>
											{activeTab === 'tab3' &&
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
											}
										</div>
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
							<div className="pb-4">Total number of reviews: {numSelectedReviews}</div>
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

