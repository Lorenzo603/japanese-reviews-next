
export const SelectCategoryButton = (props) => {

    return (
        <button className={`
            ${props.isSelected ? "bg-green-400 border border-green-600" : "bg-pink-400 hover:bg-pink-600 border border-pink-600"} 
            text-white rounded-md p-2 w-full h-full
            flex justify-center items-center
            `}
            onClick={props.handleSelectCategoryClick}>
            {props.categoryName}
        </button>
    )

}

export default SelectCategoryButton;