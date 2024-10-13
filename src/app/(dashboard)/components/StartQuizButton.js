import LoadingSpinner from "@/app/components/LoadingSpinner";

export const StartQuizButton = (props) => {

    return (
        <button type='submit' className="flex justify-center items-center w-36 h-12 p-2 
                rounded-md border-1 border-blue-600 bg-blue-600 
                disabled:bg-slate-400 disabled:border-slate-400"
            disabled={props.disabled}>
            {props.loading ? <LoadingSpinner className="loading-spinner" /> : 'Start Quiz'}
        </button>
    );
}

export default StartQuizButton;