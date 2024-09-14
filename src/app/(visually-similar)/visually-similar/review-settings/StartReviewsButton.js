import LoadingSpinner from "@/app/components/LoadingSpinner";

export const StartReviewsButton = (props) => {

    return (
        <button className={`
            ${props.isLoading ? "bg-pink-600" : "bg-pink-500"} 
            hover:bg-pink-600 text-white rounded-md p-2 w-full h-full
            flex justify-center items-center
            `}
            onClick={() => {
                props.handleStartReviewsClick(false);
            }}>
            {props.isLoading ? <LoadingSpinner className="loading-spinner" /> : "Start!"}
        </button>
    )

}

export default StartReviewsButton;