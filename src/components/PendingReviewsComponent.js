'use client'

import { Col, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useQuizContext } from '@/app/context/quizContext';

export const PendingReviewsComponent = (props) => {

    const NEXT_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

    const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
    const [totalReviewsCount, setTotalReviewsCount] = useState(0);
    const [upcomingReviewsCountArray, setUpcomingReviewsCountArray] = useState([]);
    const { setReviewSet } = useQuizContext();

    function convertDateStringToDate(array) {
        const convertedArray = array.map(obj => {
            const full_unlock_date = new Date(obj.unlock_date);
            return { ...obj, full_unlock_date };
        });

        return convertedArray;
    }

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

    function groupReviewsByUnlockDate(reviews) {
        return reviews.reduce((group, review) => {
            const { unlock_date } = review;
            if (!group.has(unlock_date)) {
                group.set(unlock_date, 1);
                return group;
            }
            group.set(unlock_date, group.get(unlock_date) + 1);
            return group;
        }, new Map());
    }

    function sortReviewsByUnlockDate(reviews) {
        return Array.from(reviews).sort(
            (a, b) => {
                const a0 = new Date(a[0]);
                const b0 = new Date(b[0]);
                return a0 > b0 ? 1 : a0 < b0 ? -1 : 0;
            }
        );
    }

    function addCumulativeSum(reviews) {
        let cumSum = 0;
        for (const review of reviews) {
            cumSum += review[1];
            review.push(cumSum);
        }
        return reviews;
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


    useEffect(() => {
        fetch('/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                console.log('GET pending reviews:', data);
                const reviews = convertDateStringToDate(data[0].reviews.filter(review => review.current_srs_stage < 9));

                const now = new Date();
                const pendingReviews = reviews.filter((review) => review.full_unlock_date <= now);
                const totalReviews = reviews.filter((review) => review.full_unlock_date > now);
                setPendingReviewsCount(pendingReviews.length);
                setTotalReviewsCount(totalReviews.length);

                const nextWeek = new Date(now.getTime() + NEXT_WEEK_MILLIS)
                const upcomingReviews = totalReviews.filter(review => review.full_unlock_date < nextWeek);
                const groupedReviews = groupReviewsByUnlockDate(upcomingReviews);
                const sortedGroupedReviews = sortReviewsByUnlockDate(groupedReviews);
                const updatedGroupedReviews = addCumulativeSum(sortedGroupedReviews);
                const dayGroupedReviews = groupByDay(updatedGroupedReviews);

                setUpcomingReviewsCountArray(dayGroupedReviews);
                console.log(dayGroupedReviews);
                setReviewSet(pendingReviews);
            })
            .catch(error => {
                console.log('ERROR getting pending reviews:', error);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <Row className="justify-content-center p-2 mt-3">
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
                    <Row className="justify-content-center p-2">
                        <Col>
                            <h4>Upcoming reviews</h4>
                        </Col>
                    </Row>
                    {
                        upcomingReviewsCountArray.map(dayGroup => {
                            return (
                                <Row>
                                    <Col>
                                        {
                                            dayGroup.map(upComingReview => {
                                                return (
                                                    <Row key={upComingReview[0]} className="justify-content-center p-1 upComing-review">
                                                        <Col className="col-4 d-flex justify-content-start p-0">
                                                            {formatDate(upComingReview[0])}:
                                                        </Col>
                                                        <Col className="col-1 d-flex justify-content-end p-0">
                                                            +{upComingReview[1]}
                                                        </Col>
                                                        <Col className="col-2 d-flex justify-content-end p-0">
                                                            {upComingReview[2]}
                                                        </Col>
                                                    </Row>
                                                );
                                            })
                                        }
                                    </Col>
                                </Row>
                            );
                        })
                    }
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