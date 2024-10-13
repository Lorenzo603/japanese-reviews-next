export const SelectionOption = (props) => {
    return (
        <button className="p-2 hover:bg-blue-700" 
            onClick={props.handleSetSelectionCallback} data-option={props.dataOption}>
            {props.children}
        </button>
    );

}

export default SelectionOption;