import { NextResponse } from 'next/server'
// import clientPromise from "../../../lib/mongodb";
// import { ObjectId } from 'mongodb';
import { withSession } from 'supertokens-node/nextjs/index.js';
import { reviews } from '../../../../drizzle/schema.ts';
import { and, eq } from 'drizzle-orm';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import db from '../../../lib/drizzleOrmDb.js';
const crypto = require("crypto");

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

ensureSuperTokensInit();

function calculateUnlockDate(srsLevel) {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return new Date(now.getTime() + srsLevelToWaitingTimeMap[srsLevel]);
}

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

        // const accountReviews = await db.collection("reviews").find({ "account_id": account._id }).toArray();
        const transformedReviews = convertDateStringToDate(allUserReviews.filter(review => review.currentSrsStage < 9));
        // for (const review of reviews) {
        //     const prompts = await db.collection("prompts").find({ "review_id": review._id }).toArray();
        //     review["prompts"] = prompts;
        // }

        const now = new Date();
        const pendingReviews = transformedReviews.filter((review) => review.fullUnlockDate <= now);
        const allUpcomingReviews = transformedReviews.filter((review) => review.fullUnlockDate > now);

        const nextWeek = new Date(now.getTime() + NEXT_WEEK_MILLIS)
        const imminentUpcomingReviews = allUpcomingReviews.filter(review => review.fullUnlockDate < nextWeek);
        const groupedReviews = groupReviewsByUnlockDate(imminentUpcomingReviews);
        const sortedGroupedReviews = sortReviewsByUnlockDate(groupedReviews);
        const updatedGroupedReviews = addCumulativeSum(sortedGroupedReviews);

        const response = {
            "reviews": transformedReviews, // TODO: check if used, maybe only include total review count, in order to reduce response size 
            "pendingReviews": pendingReviews,
            "upcomingReviews": updatedGroupedReviews,
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

export async function POST(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        const userId = session.getUserId();
        const reqJson = await request.json();
        console.log("Adding review payload:", reqJson);

        await db.insert(reviews)
            .values(
                {
                    id: crypto.randomUUID(),
                    userId: userId,
                    elementId: reqJson.element_id,
                    currentSrsStage: reqJson.current_srs_stage,
                    unlockDate: JSON.stringify(calculateUnlockDate(reqJson.current_srs_stage)).replaceAll("\"", "")
                }
            );

        // const response = await db.collection("reviews")
        //     .insertOne({
        //         account_id: new ObjectId("6487929695ecece4fa568835"),
        //         element_id: reqJson.element_id,
        //         current_srs_stage: reqJson.current_srs_stage,
        //         unlock_date: JSON.stringify(calculateUnlockDate(reqJson.current_srs_stage)).replaceAll("\"", "")
        //     });
        return NextResponse.json(response);
    });
}

export async function PUT(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }
        const userId = session.getUserId();

        const reqJson = await request.json();
        console.log("Update review payload:", reqJson)

        const result = await db.update(reviews)
        .set({
            currentSrsStage: reqJson.current_srs_stage,
            unlockDate: JSON.stringify(calculateUnlockDate(reqJson.current_srs_stage)).replaceAll("\"", "")
        })
        .where(and(
            eq(reviews.userId, userId),
            eq(reviews.elementId, reqJson.element_id)
        ))
            
        // updateOne(
        //         { "account_id": new ObjectId("6487929695ecece4fa568835"), "element_id": reqJson.element_id }, {
        //         $set: {
        //             "current_srs_stage": reqJson.current_srs_stage,
        //             "unlock_date": JSON.stringify(calculateUnlockDate(reqJson.current_srs_stage)).replaceAll("\"", "")
        //         }
        //     });

        if (result.rowCount === 0) {
            console.warn('Record not found');
            return NextResponse.json({ error: 'Bad request' }, { status: 400 })
        }
        return NextResponse.json({ message: 'OK' }, { status: 200 })
    });



}