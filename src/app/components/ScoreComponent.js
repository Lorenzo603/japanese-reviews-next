export const ScoreComponent = (props) => {

    const percentage = props.totalAnswers === 0 ? 0 : (props.totalCorrect / props.totalAnswers * 100).toFixed(2);
    function Tally() {
        return <span>{props.totalCorrect}/{props.totalAnswers}</span>
    }
    
    function Percentage() {
        return <span>{percentage}%</span>;
    }

    function TotalReviews() {
        return <span>{props.totalReviews}</span>;
    }

    return (
        <div className='flex flex-row gap-x-4 text-2xl text-right'>
            <div><Tally /></div>
            <div><Percentage /></div>
            <div className="w-20 text-center border border-blue-400"><TotalReviews /></div>
        </div>
    );
}

export default ScoreComponent;