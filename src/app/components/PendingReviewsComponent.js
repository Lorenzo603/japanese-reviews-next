import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { DateTime } from "luxon";

export const PendingReviewsComponent = (props) => {

	const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
	const [totalReviewsCount, setTotalReviewsCount] = useState(0);
	const [upcomingReviewsCountArray, setUpcomingReviewsCountArray] = useState([]);

	const [pendingReviewsLoading, setPendingReviewsLoading] = useState(false);
	const [earliestUnlockDateAfterUpcoming, setEarliestUnlockDateAfterUpcoming] = useState(null);

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

	function convertReviewDateFromUTCtoLocalTimezone(review) {
		review[0] = convertDateFromUTCtoLocalTimezone(review[0]);
		return review;
	}

	function convertDateFromUTCtoLocalTimezone(date) {
		// make sure date coming from API is read as UTC, then convert it to local time
		const parsedDate = DateTime.fromISO(date.replace(' ', 'T'), { zone: "UTC" });
		return parsedDate.toLocal().toJSDate();
	}

	function groupByDay(reviews) {
		const groupedItems = reviews.reduce((groups, review) => {
			const day = review[0].getDate();
			if (!groups[day]) {
				groups[day] = [];
			}
			groups[day].push(review);
			return groups;
		}, {});

		return Object.values(groupedItems);
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

				// TODO: do not pass full pending review list, only count
				const reviews = data.reviews;
				setTotalReviewsCount(reviews.length);

				const pendingReviews = data.pendingReviews;
				setPendingReviewsCount(pendingReviews.length);

				const upcomingReviews = data.upcomingReviews;
				const localTimezoneReviews = upcomingReviews.map(review => convertReviewDateFromUTCtoLocalTimezone(review));
				const dayGroupedReviews = groupByDay(localTimezoneReviews);
				console.log(dayGroupedReviews);
				setUpcomingReviewsCountArray(sortReviews(dayGroupedReviews));

				setEarliestUnlockDateAfterUpcoming(data.earliestUnlockDateAfterUpcoming);
			})
			.catch(error => {
				console.log('ERROR getting pending reviews:', error);
			})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<div className='flex flex-col gap-y-4 items-center'>
			<div>
				<button className="flex justify-center items-center w-48 h-10 p-2 
                    rounded-md border-1 border-blue-600 bg-blue-600 
                    disabled:bg-gray-500 disabled:border-gray-500 disabled:text-gray-300"
					disabled={pendingReviewsLoading || pendingReviewsCount === 0}
					data-option='review'
					onClick={(e) => {
						setPendingReviewsLoading(true);
						props.handleSetSelection(e);
					}}>
					{pendingReviewsLoading ? <LoadingSpinner className="loading-spinner" /> : `Pending reviews: ${pendingReviewsCount}`}
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
			{
				earliestUnlockDateAfterUpcoming &&
				<div>
					Next review at: {formatDate(convertDateFromUTCtoLocalTimezone(earliestUnlockDateAfterUpcoming).toString())}
				</div>
			}
		</div>
	);
}

export default PendingReviewsComponent;