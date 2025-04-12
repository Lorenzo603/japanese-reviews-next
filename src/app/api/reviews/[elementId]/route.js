import { NextResponse } from 'next/server'
// import clientPromise from "../../../../lib/mongodb";
// import { ObjectId } from 'mongodb';
import db from "../../../../lib/drizzleOrmDb.js";
import { reviews } from '../../../../../drizzle/schema.ts';
import { and, eq } from 'drizzle-orm';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import { withSession } from 'supertokens-node/nextjs/index.js';
import { calculateNewSrsStage, calculateUnlockDate, DEFAULT_PROMPTS_JSON } from '@/app/components/backend/srs/SrsService.js';
import { getPendingReviews } from '@/app/components/backend/reviews/ReviewService.js';
const crypto = require("crypto");

ensureSuperTokensInit();

export async function GET(request, props) {
    const params = await props.params;

    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        const userId = session.getUserId();
        const elementId = params.elementId;
        console.log(`Getting review for user ${userId} with element id ${elementId}...`);

        const reviewsByElementId = await db
            .select()
            .from(reviews)
            .where(
                and(
                    eq(reviews.userId, userId),
                    eq(reviews.elementId, elementId),
                )
            );

        return NextResponse.json(reviewsByElementId);
    });
}

export async function POST(request, props) {
    const params = await props.params;
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        const userId = session.getUserId();
        const elementId = params.elementId;
        console.log(`Creating review for user ${userId} with element id ${elementId}...`);

        const result = await db.insert(reviews)
            .values(
                {
                    id: crypto.randomUUID(),
                    userId: userId,
                    elementId: parseInt(elementId),
                    currentSrsStage: 1,
                    unlockDate: calculateUnlockDate(1),
                    prompts: DEFAULT_PROMPTS_JSON
                }
            );
        if (result.rowCount === 0) {
            console.warn('Error creating record');
            return NextResponse.json({ error: 'Bad request' }, { status: 400 })
        }
        return NextResponse.json({ message: 'CREATED' }, { status: 201 })
    });
}


export async function PUT(request, props) {
    const params = await props.params;
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }
        const userId = session.getUserId();
        const elementId = params.elementId;
        const reqJson = await request.json();
        console.log(`Update prompt review for user ${userId} with element id ${elementId}, payload:`, reqJson);
        // reqJson payload:
        // {
        //     mode: "meaning",
        //     correct: true
        // }

        // TODO: maybe fetch directly the single review with a query instead of iterating the pendingreviews, but be careful not to include "finished" reviews
        const pendingReviews = await getPendingReviews(userId);
        const reviewToUpdate = pendingReviews.filter(review => review.elementId === parseInt(elementId))[0];
        const prompts = reviewToUpdate.prompts;
        const currentPrompt = prompts.filter(prompt => prompt.mode === reqJson.mode)[0];
        currentPrompt.answered = true;
        currentPrompt.correct = reqJson.correct;

        const updateObj = {};
        if (prompts.every(prompt => prompt.answered === true)) {
            updateObj["prompts"] = DEFAULT_PROMPTS_JSON;
            updateObj["currentSrsStage"] = calculateNewSrsStage(reviewToUpdate.currentSrsStage, prompts);
            updateObj["unlockDate"] = calculateUnlockDate(updateObj["currentSrsStage"]);
        } else {
            updateObj["prompts"] = prompts;
        }

        const result = await db.update(reviews)
            .set(updateObj)
            .where(and(
                eq(reviews.userId, userId),
                eq(reviews.elementId, elementId)
            ))

        if (result.rowCount === 0) {
            console.warn('Record not found');
            return NextResponse.json({ error: 'Bad request' }, { status: 400 })
        }
        return NextResponse.json({ message: 'OK' }, { status: 200 })
    });
}
