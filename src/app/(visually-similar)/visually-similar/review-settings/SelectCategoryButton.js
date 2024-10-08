
export const SelectCategoryButton = (props) => {

    return (
        <button className={`
            ${props.isSelected ? "bg-green-400 border border-green-600" : "bg-pink-400 hover:bg-pink-600 border border-pink-600"} 
            text-white rounded-md p-2 w-full h-full min-h-32
            flex justify-center items-center
            `}
            onClick={props.handleSelectCategoryClick}>

            <div className="flex flex-col w-full h-full">
                <div className="flex flex-row justify-between">
                    <div>
                        &#9917;
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>

                    </div>
                </div>
                <div className="flex grow items-center justify-center">
                    <div className="text-lg">{props.categoryName}</div>
                </div>

                <div className="text-sm text-right mt-2">{props.numItems} items</div>
            </div>
        </button>
    )

}

export default SelectCategoryButton;