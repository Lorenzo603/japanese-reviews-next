import { NextResponse } from 'next/server'
import clientPromise from "../../../lib/mongodb";

const NEXT_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

const srsLevelToWaitingTimeMap = {
    1: (4 * 60 * 60 * 1000), // 4 hours
    2: (8 * 60 * 60 * 1000), // 8 hours
    3: (24 * 60 * 60 * 1000), // 1 day
    4: (2 * 24 * 60 * 60 * 1000), // 2 days
    5: (7 * 24 * 60 * 60 * 1000), // 1 week
    6: (2 * 7 * 24 * 60 * 60 * 1000), // 2 weeks
    7: (4 * 7 * 24 * 60 * 60 * 1000), // 1 month
    8: (4 * 4 * 7 * 24 * 60 * 60 * 1000), // 4 months
    9: (100 * 12 * 4 * 7 * 24 * 60 * 60 * 1000), // Forever
};

function calculateUnlockDate(srsLevel) {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return new Date(now.getTime() + srsLevelToWaitingTimeMap[srsLevel]);
}

export async function GET() {
    console.log("Getting all reviews...");
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const accounts = await db.collection("accounts").find({ "username": "Lorenzo" }).toArray();
    // console.log("Account info DB response:", accounts);

    const reviews = convertDateStringToDate(accounts[0].reviews.filter(review => review.current_srs_stage < 9));

    const now = new Date();
    const pendingReviews = reviews.filter((review) => review.full_unlock_date <= now);
    const allUpcomingReviews = reviews.filter((review) => review.full_unlock_date > now);

    const nextWeek = new Date(now.getTime() + NEXT_WEEK_MILLIS)
    const imminentUpcomingReviews = allUpcomingReviews.filter(review => review.full_unlock_date < nextWeek);
    const groupedReviews = groupReviewsByUnlockDate(imminentUpcomingReviews);
    const sortedGroupedReviews = sortReviewsByUnlockDate(groupedReviews);
    const updatedGroupedReviews = addCumulativeSum(sortedGroupedReviews);

    const response = {
        "reviews": reviews,
        "pendingReviews": pendingReviews,
        "upcomingReviews": updatedGroupedReviews,
    }
    return NextResponse.json(response);
}

function convertDateStringToDate(array) {
    const convertedArray = array.map(obj => {
        const full_unlock_date = new Date(obj.unlock_date);
        return { ...obj, full_unlock_date };
    });

    return convertedArray;
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

export async function POST(request) {
    const reqJson = await request.json();
    console.log("Add review payload:", reqJson);

    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts")
        .updateOne(
            { "username": "Lorenzo" }, {
            $addToSet: {
                "reviews": {
                    element_id: reqJson.element_id,
                    current_srs_stage: reqJson.current_srs_stage,
                    unlock_date: JSON.stringify(calculateUnlockDate(reqJson.current_srs_stage)).replaceAll("\"", "")
                }
            }
        });
    return NextResponse.json(response);
}

export async function PUT(request) {
    const reqJson = await request.json();
    console.log("Update review payload:", reqJson)

    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts")
        .updateOne(
            { "username": "Lorenzo", "reviews.element_id": reqJson.element_id }, {
            $set: {
                "reviews.$.current_srs_stage": reqJson.current_srs_stage,
                "reviews.$.unlock_date": JSON.stringify(calculateUnlockDate(reqJson.current_srs_stage)).replaceAll("\"", "")
            }
        });
    return NextResponse.json(response);
}