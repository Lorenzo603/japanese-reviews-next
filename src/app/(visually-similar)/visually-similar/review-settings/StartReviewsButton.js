import LoadingSpinner from "@/app/components/LoadingSpinner";

export const StartReviewsButton = (props) => {

    return (
        <button className={`
            ${props.isActive ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-300 cursor-default"} 
            text-white rounded-md p-2 w-48 h-10
            flex justify-center items-center
            `}
            onClick={() => {
                if (!props.isActive) return;
                props.handleStartReviewsClick(false);
            }}>
            {props.isLoading ? <LoadingSpinner className="loading-spinner" /> : <span className="font-bold">Start!</span>}
        </button>
    )

}

export default StartReviewsButton;