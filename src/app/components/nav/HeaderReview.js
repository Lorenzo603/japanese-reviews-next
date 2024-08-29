import { useReviewSessionContext } from "@/app/context/reviewSessionContext";
import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";

const HeaderReview = () => {

    const { promptSet } = useVisuallySimilarQuizContext();
    const { totalAnswers, totalCorrect } = useReviewSessionContext();

    const totalReviews = promptSet.length;;

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6">
                <div className="flex">
                    Settings - enablefocusmode, endSession
                </div>
                <div className="flex">
                    <div className="flex gap-x-4">
                        <div>
                            {totalCorrect}/{totalAnswers}
                        </div>
                        <div>
                            {Math.round(totalCorrect/totalReviews * 100)}&#37;
                        </div>
                        <div>
                            {totalReviews}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="relative w-full transition-opacity duration-fast bg-pink-100 h-2 overflow-hidden">
                <div className="absolute bottom-0 left-0 top-0 h-full shadow-progress-bar-fill transition-all bg-red-500"
                    role="progressbar" style={{ width: `${Math.round(totalAnswers/totalReviews * 100)}%` }}></div>
            </div>

        </header>
    );
}

export default HeaderReview;