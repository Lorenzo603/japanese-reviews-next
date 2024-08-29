
const HeaderReview = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-pink-200">
            <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6">
                <div className="flex">
                    Settings - enablefocusmode, endSession
                </div>
                <div className="flex">
                    <div className="flex">
                        <div>
                            totalCorrect/totalAnswers
                        </div>
                        <div>
                            correctPercentrage%
                        </div>
                        <div>
                            totalReviews
                        </div>
                    </div>
                </div>
            </nav>
            <div className="relative w-full transition-opacity duration-fast bg-pink-100 h-2 overflow-hidden">
                <div className="absolute bottom-0 left-0 top-0 h-full shadow-progress-bar-fill transition-all bg-red-500"
                    role="progressbar" style={{ width: '100%' }}></div>
            </div>

        </header>
    );
}

export default HeaderReview;