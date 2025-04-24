import { NextResponse } from 'next/server'
// import clientPromise from "../../../lib/mongodb";
// import { ObjectId } from 'mongodb';
import { withSession } from 'supertokens-node/nextjs/index.js';
import { reviews } from '../../../../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import db from '../../../lib/drizzleOrmDb.js';

const NEXT_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

ensureSuperTokensInit();

export async function GET(request) {
	return withSession(request, async (err, session) => {
		if (err) {
			console.error(err);
			return NextResponse.json(err, { status: 500 });
		}
		if (!session) {
			return new NextResponse("Authentication required", { status: 401 });
		}

		const userId = session.getUserId();
		console.log("Getting all reviews for user:", userId);

		const allUserReviews = await db
			.select()
			.from(reviews)
			.where(eq(reviews.userId, userId));

		const transformedReviews = convertDateStringToDate(allUserReviews.filter(review => review.currentSrsStage < 9));

		const now = new Date();
		const pendingReviews = transformedReviews.filter((review) => review.fullUnlockDate <= now);
		const allUpcomingReviews = transformedReviews.filter((review) => review.fullUnlockDate > now);

		const nextWeek = new Date(now.getTime() + NEXT_WEEK_MILLIS)

		const imminentUpcomingReviews = allUpcomingReviews.filter(review => review.fullUnlockDate < nextWeek);
		const groupedReviews = groupReviewsByUnlockDate(imminentUpcomingReviews);
		const sortedGroupedReviews = sortReviewsByUnlockDate(groupedReviews);
		const updatedGroupedReviews = addCumulativeSum(sortedGroupedReviews);

		const firstReviewAfterUpcoming = allUpcomingReviews.filter(review => review.fullUnlockDate >= nextWeek)
		const earliestReviews = firstReviewAfterUpcoming.sort((a, b) => a.fullUnlockDate - b.fullUnlockDate).slice(0, 1);
		const earliestUnlockDateAfterUpcoming = earliestReviews.length > 0 ? earliestReviews[0].fullUnlockDate : null

		const response = {
			"reviews": transformedReviews, // TODO: check if used, maybe only include total review count, in order to reduce response size 
			"pendingReviews": pendingReviews,
			"upcomingReviews": updatedGroupedReviews,
			"earliestUnlockDateAfterUpcoming": earliestUnlockDateAfterUpcoming >= nextWeek ? earliestUnlockDateAfterUpcoming : null,
		}

		return NextResponse.json(response);
	});

}

function convertDateStringToDate(array) {
	const convertedArray = array.map(obj => {
		const fullUnlockDate = new Date(obj.unlockDate);
		return { ...obj, fullUnlockDate };
	});

	return convertedArray;
}

function groupReviewsByUnlockDate(reviews) {
	return reviews.reduce((group, review) => {
		const { unlockDate } = review;
		if (!group.has(unlockDate)) {
			group.set(unlockDate, 1);
			return group;
		}
		group.set(unlockDate, group.get(unlockDate) + 1);
		return group;
	}, new Map());
}

function sortReviewsByUnlockDate(reviews) {
	return Array.from(reviews).sort(
		(a, b) => {
			const a0 = a[0];
			const b0 = b[0];
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

