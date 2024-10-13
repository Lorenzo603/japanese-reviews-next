
export const SelectModeButton = (props) => {

    return (
        <button id={props.id} className={`p-2 ${props.checked ? 'border-2 border-blue-600' : ''}`} onClick={props.onClickHander}>{props.children}</button>
    );
};

export default SelectModeButton;