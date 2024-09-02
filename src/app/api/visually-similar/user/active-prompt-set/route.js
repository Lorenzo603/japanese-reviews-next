import { NextResponse } from "next/server";
import db from "../../../../../lib/drizzleOrmDb.js";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/app/(auth)/sign-in/config/backend.js";
import { userReviewsActive, userSettings } from "../../../../../../drizzle/schema.ts";
import { and, eq } from "drizzle-orm";

ensureSuperTokensInit();

export async function GET(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }

        const userId = session.getUserId();
        try {
            const result = await db
                .select()
                .from(userReviewsActive)
                .where(
                    and(
                        eq(userReviewsActive.userId, userId),
                        eq(userReviewsActive.active, true),
                    )
                );

            if (result.length === 0) {
                console.warn('No records found when getting userSettings of user: ' + userId);
                return NextResponse.json({}, { status: 200 })
            }
            if (result.length > 1) {
                console.warn('Multiple active prompt sets found for user: ' + userId);
            }
            return NextResponse.json(result[0], { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    });
}
