import { useEffect, useState } from 'react';
import { useQuizContext } from '@/app/context/quizContext';

export const PendingReviewsComponent = (props) => {

    const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
    const [totalReviewsCount, setTotalReviewsCount] = useState(0);
    const [upcomingReviewsCountArray, setUpcomingReviewsCountArray] = useState([]);
    const { setReviewSet } = useQuizContext();


    function formatDate(dateString) {
        const parsedDate = new Date(dateString);

        const month = parsedDate.toLocaleString('default', { month: 'short' });
        const day = parsedDate.getDate();

        const hours = parsedDate.getHours();
        const minutes = parsedDate.getMinutes();

        const formattedDate = `${month} ${day},`;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return `${formattedDate} ${formattedTime}`;
    }


    function groupByDay(reviews) {
        const groupedItems = reviews.reduce((groups, review) => {
            const parsedDate = new Date(review[0]);
            const day = parsedDate.getDate();
            if (!groups[day]) {
                groups[day] = [];
            }
            groups[day].push(review);
            return groups;
        }, {});

        return Object.values(groupedItems);;
    }

    function sortReviews(reviews) {
        return Array.from(reviews).sort(
            (a, b) => {
                const a0 = a[0][0];
                const b0 = b[0][0];
                return a0 > b0 ? 1 : a0 < b0 ? -1 : 0;
            }
        );
    }

    useEffect(() => {
        fetch('/api/reviews')
            .then((res) => res.json())
            .then((data) => {
                // console.log('GET pending reviews:', data);

                const reviews = data.reviews;
                const pendingReviews = data.pendingReviews;
                const upcomingReviews = data.upcomingReviews;

                setTotalReviewsCount(reviews.length);
                setPendingReviewsCount(pendingReviews.length);

                const dayGroupedReviews = groupByDay(upcomingReviews);
                // console.log(dayGroupedReviews);
                setUpcomingReviewsCountArray(sortReviews(dayGroupedReviews));

                setReviewSet(pendingReviews);
            })
            .catch(error => {
                console.log('ERROR getting pending reviews:', error);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className='flex flex-col gap-y-4 items-center'>
            <div>
                <button className="flex justify-center items-center p-2 
                    rounded-md border-1 border-blue-600 bg-blue-600 
                    disabled:bg-gray-500 disabled:border-gray-500 disabled:text-gray-300"
                    disabled={pendingReviewsCount === 0}
                    data-option='review'
                    onClick={props.handleSetSelection}>
                    Pending reviews: {pendingReviewsCount}
                </button>
            </div>
            <div>
                <div>
                    <h4>Upcoming reviews</h4>
                </div>
                {
                    upcomingReviewsCountArray.map(dayGroup => {
                        return (
                            <div key={dayGroup}>
                                {
                                    dayGroup.map(upComingReview => {
                                        return (
                                            <div key={upComingReview[0]}
                                                className="flex flex-row justify-between gap-x-2 first:border-t-2 px-4">
                                                <div className="flex justify-start w-28">
                                                    {formatDate(upComingReview[0])}:
                                                </div>
                                                <div className="flex flex-grow justify-end text-right">
                                                    +{upComingReview[1]}
                                                </div>
                                                <div className="flex justify-end w-16">
                                                    {upComingReview[2] + pendingReviewsCount}
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
            <div>
                Total reviews: {totalReviewsCount}
            </div>
        </div>
    );
}

export default PendingReviewsComponent;