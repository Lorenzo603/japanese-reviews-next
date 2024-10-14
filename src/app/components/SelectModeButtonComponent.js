
export const SelectModeButton = (props) => {

    return (
        <button id={props.id} className={`p-2 border-2 ${props.checked ? 'border-blue-600' : 'border-dashboardBackgroundDark'}`} onClick={props.onClickHander}>{props.children}</button>
    );
};

export default SelectModeButton;