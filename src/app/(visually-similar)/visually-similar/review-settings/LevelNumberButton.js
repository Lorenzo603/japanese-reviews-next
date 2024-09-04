import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useState } from "react";

export const LevelNumberButton = (props) => {

    const [isLoading, setIsLoading] = useState(false);

    return (
        <button className={`
            ${isLoading ? "bg-pink-600" : "bg-pink-500"} 
            hover:bg-pink-600 text-white rounded-md p-2 w-full h-full
            flex justify-center items-center
            `}
            onClick={() => {
                const shouldStartLoading = props.handleLevelNumberClick(props.index);
                setIsLoading(shouldStartLoading); 
            }}>
            {isLoading ? <LoadingSpinner className="loading-spinner" /> : props.index}
        </button>
    )

}

export default LevelNumberButton;