import { Col, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export const PendingReviewsComponent = () => {

    const [pendingReviews, setPendingReviews] = useState(0);
    const [nextUnlock, setNextUnlock] = useState(null);
    const [upcomingReviews, setUpcomingReviews] = useState(0);

    function findClosestNextDate(arr) {
        let closestNextDate = arr[0].unlock_date;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i].unlock_date < closestNextDate) {
                closestNextDate = arr[i].unlock_date;
            }
        }

        return closestNextDate;
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

    function getPendingReviewsCount(arr) {
        const today = new Date();
        const filteredArray = arr.filter((obj) => obj.unlock_date < today);
        return filteredArray.length;
    }

    useEffect(() => {
        fetch('/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                console.log('fetching GET review result:', data);
                const reviews = data[0].reviews;

                setPendingReviews(getPendingReviewsCount(reviews));
                setNextUnlock(formatDate(findClosestNextDate(reviews)));
                setUpcomingReviews(reviews.length);

            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Row className="justify-content-center">
            <Col className="col-4">
                <Button type='submit'>Pending reviews: {pendingReviews}</Button>
            </Col>
            <Col className="col-4">
                Next Unlock: {nextUnlock}
            </Col>
            <Col className="col-4">
                Upcoming reviews: {upcomingReviews}
            </Col>
        </Row>
    );
}

export default PendingReviewsComponent;