
export const AnswerButton = (props) => {

    return (
        <button 
            className={`
                w-full p-2 rounded-md border-2 
                ${props.colorClass}
            `}
            onClick={props.handleUserAnswer}>
            <span className={`${props.guessKanji ? "japanese-font text-4xl" : "text-2xl"}`}>{props.answer}</span>
        </button>

    )

}

export default AnswerButton;