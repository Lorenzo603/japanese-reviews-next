import { NextResponse } from 'next/server'
import db from "../../../../lib/drizzleOrmDb.js";
import { reviews } from '../../../../../drizzle/schema.ts';
import { and, eq } from 'drizzle-orm';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import { withSession } from 'supertokens-node/nextjs/index.js';
import { calculateUnlockDate, DEFAULT_PROMPTS_JSON } from '@/app/components/backend/srs/SrsService.js';

ensureSuperTokensInit();

export async function PUT(request, { params }) {

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
        console.log(`Decreasing SRS review for user ${userId} with element id ${elementId}...`);

        const reviewByElementId = await db
            .select()
            .from(reviews)
            .where(
                and(
                    eq(reviews.userId, userId),
                    eq(reviews.elementId, elementId),
                )
            )[0];
        const newSrsStage = reviewByElementId.currentSrsStage - 2;

        const updateObj = {
            prompts: DEFAULT_PROMPTS_JSON,
            currentSrsStage: newSrsStage,
            unlockDate: calculateUnlockDate(newSrsStage)
        };

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