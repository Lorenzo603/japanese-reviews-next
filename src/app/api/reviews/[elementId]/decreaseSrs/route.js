import { NextResponse } from 'next/server'
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import { withSession } from 'supertokens-node/nextjs/index.js';
import { calculateUnlockDate, clampSrsStage, DEFAULT_PROMPTS_JSON } from '@/app/components/backend/srs/SrsService.js';
import db from '@/lib/drizzleOrmDb';
import { and, eq } from 'drizzle-orm';
import { reviews } from '../../../../../../drizzle/schema.ts';

ensureSuperTokensInit();

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
        console.log(`Decreasing SRS review for user ${userId} with element id ${elementId}...`);

        const reviewsByElementId = await db
            .select()
            .from(reviews)
            .where(
                and(
                    eq(reviews.userId, userId),
                    eq(reviews.elementId, elementId),
                )
            );

        const newSrsStage =  clampSrsStage(reviewsByElementId[0].currentSrsStage - 2);
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