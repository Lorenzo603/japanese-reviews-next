import { useReviewSessionContext } from "@/app/context/reviewSessionContext";
import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";
import { useState } from "react";

const HeaderReview = () => {

    const { promptSet } = useVisuallySimilarQuizContext();
    const { totalAnswers, totalCorrect } = useReviewSessionContext();

    const totalReviews = promptSet.length;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [focusModeEnabled, setFocusModeEnabled] = useState(false);
    function toggleFocusMode() {
        setFocusModeEnabled(!focusModeEnabled);
        toggleMenu();
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-x-6 p-6">
                <button className="flex bg-slate-50 rounded-full" onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>

                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={toggleMenu}
                ></div>

                {/* Sidebar Menu */}
                <div
                    className={`fixed top-0 left-0 h-full bg-white shadow-md z-50 w-3/4 md:w-1/3 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="p-4 flex flex-col h-full">
                        {/* Close Button */}
                        <div className="flex">
                            <button
                                onClick={toggleMenu}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>

                            </button>
                        </div>

                        <h2 className="text-xl font-bold mb-4">Menu</h2>


                        <ul className="flex-grow">
                            <li className="py-2">
                                <button className="text-gray-800 hover:text-gray-600" onClick={toggleFocusMode}>
                                    <div className="flex flex-row gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                        {focusModeEnabled ? "Disable" : "Enable"} Focus Mode
                                    </div>
                                </button>
                            </li>
                            <div aria-hidden="false" class="w-full h-1"><hr class="block bg-rim w-full h-1" /></div>
                            <li className="py-2">
                                <button className="text-gray-800 hover:text-gray-600">
                                    <div className="flex flex-row gap-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                        </svg>
                                        End Session
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {
                    !focusModeEnabled &&
                    <div className="flex">
                        <div className="flex gap-x-6">
                            <div className="flex flex-row gap-x-1 select-none" title="Current count of correct answers vs. total answered so far">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>

                                {totalCorrect}/{totalAnswers}
                            </div>
                            <div className="flex flex-row gap-x-1 select-none" title="Current count of correct answers vs. total reviews">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                {Math.round(totalCorrect / totalReviews * 100)}&#37;
                            </div>
                            <div className="flex flex-row gap-x-1 select-none" title="Total reviews of this batch">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                </svg>

                                {totalReviews}
                            </div>
                        </div>
                    </div>
                }

            </div>
            <div className="relative w-full transition-opacity duration-fast bg-pink-100 h-2 overflow-hidden">
                <div className="absolute bottom-0 left-0 top-0 h-full shadow-progress-bar-fill transition-all bg-red-500"
                    role="progressbar" style={{ width: `${Math.round(totalAnswers / totalReviews * 100)}%` }}></div>
            </div>

        </header>
    );
}

export default HeaderReview;