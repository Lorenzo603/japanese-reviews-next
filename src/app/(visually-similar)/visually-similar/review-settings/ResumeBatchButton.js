import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useState } from "react";


export const ResumeBatchButton = (props) => {

    const [isLoading, setIsLoading] = useState(false);

    return (
        <button className={`
            ${props.isLoading ? "bg-pink-600" : "bg-pink-500"} 
            hover:bg-pink-600 text-white rounded-md p-2 w-48 h-10  
            flex justify-center items-center gap-2`}
            onClick={() => {
                setIsLoading(true);
                props.resumeBatch()
            }}>
            {
                isLoading
                    ? <LoadingSpinner className="loading-spinner" />
                    :
                    <>
                        <span className="inline">Resume Batch</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                    </>
            }
        </button>
    )

}

export default ResumeBatchButton;