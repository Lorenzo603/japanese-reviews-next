export const RadioSelectModeComponent = (props) => {

    return (

        <div className="flex flex-row gap-x-4 items-center">
            <div className='text-lg'>
                {props.title}
            </div>

            {props.children}

        </div>

    );
}

export default RadioSelectModeComponent;