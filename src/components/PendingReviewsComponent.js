'use client'

import { Col, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useQuizContext } from '@/app/context/quizContext';

export const PendingReviewsComponent = (props) => {

    const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
    const [nextUnlock, setNextUnlock] = useState(null);
    const [upcomingReviewsCount, setUpcomingReviewsCount] = useState(0);
    const { setReviewSet } = useQuizContext();

    function convertDateStringToDate(array) {
        const convertedArray = array.map(obj => {
            const unlock_date = new Date(obj.unlock_date);
            return { ...obj, unlock_date };
        });

        return convertedArray;
    }

    function formatDate(dateString) {
        const parsedDate = new Date(dateString);

        const month = parsedDate.toLocaleString('default', { month: 'short' });
        const day = parsedDate.getDate();
        const year = parsedDate.getFullYear();

        const hours = parsedDate.getHours();
        const minutes = parsedDate.getMinutes();

        const formattedDate = `${month} ${day}, ${year}`;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return `${formattedDate} ${formattedTime}`;
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
                const reviews = convertDateStringToDate(data[0].reviews.filter(review => review.current_srs_stage < 9));

                const now = new Date();
                const pendingReviews = reviews.filter((review) => review.unlock_date < now);
                const upcomingReviews = reviews.filter((review) => review.unlock_date > now);
                setPendingReviewsCount(pendingReviews.length);
                setNextUnlock(findClosestNextDate(upcomingReviews));
                setUpcomingReviewsCount(upcomingReviews.length);

                setReviewSet(pendingReviews);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <Row className="justify-content-center p-3">
                <Col>
                    <Button className="start-quiz-button" disabled={pendingReviewsCount == 0}
                        data-option='review'
                        onClick={props.handleSetSelection}>
                        Pending reviews: {pendingReviewsCount}
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center p-3">
                <Col>
                    Next Unlock: {nextUnlock}
                </Col>
            </Row>
            <Row className="justify-content-center p-3">
                <Col>
                    Upcoming reviews: {upcomingReviewsCount}
                </Col>
            </Row>
        </>
    );
}

export default PendingReviewsComponent;