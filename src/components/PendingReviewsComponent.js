import { Col, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export const PendingReviewsComponent = (props) => {

    const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
    const [nextUnlock, setNextUnlock] = useState(null);
    const [upcomingReviewsCount, setUpcomingReviewsCount] = useState(0);
    const [reviewSet, setReviewSet] = useState([]);

    function convertDateStringToDate(array) {
        const convertedArray = array.map(obj => {
            const unlock_date = new Date(obj.unlock_date);
            return { ...obj, unlock_date };
        });

        return convertedArray;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString('en', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        const formattedTime = date.toLocaleTimeString('en', {
            hour: 'numeric',
            hour12: false,
        });

        return `${formattedDate} - ${formattedTime}h`;
    }

    function findClosestNextDate(arr) {
        if (arr.length === 0) {
            return "None!";
        }
        let closestNextDate = arr[0].unlock_date;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i].unlock_date < closestNextDate) {
                closestNextDate = arr[i].unlock_date;
            }
        }

        return formatDate(closestNextDate);
    }

    useEffect(() => {
        fetch('/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                console.log('GET pending reviews:', data);
                const reviews = convertDateStringToDate(data[0].reviews);

                const now = new Date();
                const pendingReviews = reviews.filter((review) => review.unlock_date < now);
                const upcomingReviews = reviews.filter((review) => review.unlock_date > now);
                setPendingReviewsCount(pendingReviews.length);
                setNextUnlock(findClosestNextDate(upcomingReviews));
                setUpcomingReviewsCount(upcomingReviews.length);

                setReviewSet(pendingReviews.map(review => review.element_id));
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Row className="justify-content-center">
            <Col className="col-4">
                <Button className="pending-reviews-button" disabled={pendingReviewsCount == 0}
                    data-option='review' data-review-set={reviewSet}
                    onClick={props.handleSetSelection}>
                    Pending reviews: {pendingReviewsCount}
                </Button>
            </Col>
            <Col className="col-4">
                Next Unlock: {nextUnlock}
            </Col>
            <Col className="col-4">
                Upcoming reviews: {upcomingReviewsCount}
            </Col>
        </Row>
    );
}

export default PendingReviewsComponent;