import { useReviewSessionContext } from "@/app/context/reviewSessionContext";
import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";

const HeaderReview = () => {

    const { promptSet } = useVisuallySimilarQuizContext();
    const { totalAnswers, totalCorrect } = useReviewSessionContext();

    const totalReviews = promptSet.length;;

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-x-6 p-6">
                <div className="flex bg-slate-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <div>enablefocusmode</div>
                    <div>endSession</div>
                </div>
                <div className="flex">
                    <div className="flex gap-x-4">
                        <div className="select-none" title="Current count of correct answers vs. total answered so far">
                            {totalCorrect}/{totalAnswers}
                        </div>
                        <div className="select-none" title="Current count of correct answers vs. total reviews">
                            {Math.round(totalCorrect / totalReviews * 100)}&#37;
                        </div>
                        <div className="select-none" title="Total reviews of this batch">
                            {totalReviews}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="relative w-full transition-opacity duration-fast bg-pink-100 h-2 overflow-hidden">
                <div className="absolute bottom-0 left-0 top-0 h-full shadow-progress-bar-fill transition-all bg-red-500"
                    role="progressbar" style={{ width: `${Math.round(totalAnswers / totalReviews * 100)}%` }}></div>
            </div>

        </header>
    );
}

export default HeaderReview;