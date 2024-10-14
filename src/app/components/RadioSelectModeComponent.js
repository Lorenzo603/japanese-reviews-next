export const RadioSelectModeComponent = (props) => {

    return (
        <div className="flex flex-row gap-x-4 items-center pb-6">
            <div className='w-32 text-lg text-right'>
                {props.title}
            </div>
            {props.children}
        </div>
    );
}

export default RadioSelectModeComponent;