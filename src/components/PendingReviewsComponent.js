'use client'

import { Col, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useQuizContext } from '@/app/context/quizContext';

export const PendingReviewsComponent = (props) => {

    const NEXT_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

    const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
    const [nextUnlock, setNextUnlock] = useState(null);
    const [totalReviewsCount, setTotalReviewsCount] = useState(0);
    const [upcomingReviewsCountArrayMap, setUpcomingReviewsCountArrayMap] = useState([]);
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
                const pendingReviews = reviews.filter((review) => review.unlock_date <= now);
                const totalReviews = reviews.filter((review) => review.unlock_date > now);
                setPendingReviewsCount(pendingReviews.length);
                setNextUnlock(findClosestNextDate(totalReviews));
                setTotalReviewsCount(totalReviews.length);

                const nextWeek = new Date(now.getTime() + NEXT_WEEK_MILLIS)
                const upcomingReviews = totalReviews.filter(review => review.unlock_date < nextWeek);
                const groupedReviews = upcomingReviews.reduce((group, review) => {
                    const { unlock_date } = review;
                    const formattedDate = formatDate(unlock_date);
                    if (!group.has(formattedDate)) {
                        group.set(formattedDate, 1);
                        return group;
                    }
                    group.set(formattedDate, group.get(formattedDate) + 1);
                    return group;
                }, new Map());
                const sortedGroupedReviews = Array.from(groupedReviews).sort(
                    (a, b) => {
                        const a0 = new Date(a[0]);
                        const b0 = new Date(b[0]);
                        return a0 > b0 ? 1 : a0 < b0 ? -1 : 0;
                    }
                );
                setUpcomingReviewsCountArrayMap(sortedGroupedReviews);
                setReviewSet(pendingReviews);
            })
            .catch(error => {
                console.log('ERROR getting pending reviews:', error);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <Row className="justify-content-center p-3">
                <Col>
                    <Button className="start-quiz-button" disabled={pendingReviewsCount === 0}
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
                    <Row className="justify-content-center p-2">Upcoming reviews:</Row>
                    {upcomingReviewsCountArrayMap.map(upComingReview => {
                        return (
                            <Row key={upComingReview[0]} className="justify-content-center p-1">
                                <Col className="col-8">
                                    {upComingReview[0]}:
                                </Col>
                                <Col className="col-2">
                                    {upComingReview[1]}
                                </Col>
                            </Row>
                        );
                    })}
                </Col>
            </Row>
            <Row className="justify-content-center p-3">
                <Col>
                    Total reviews: {totalReviewsCount}
                </Col>
            </Row>
        </>
    );
}

export default PendingReviewsComponent;