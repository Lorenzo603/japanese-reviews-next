import { NextResponse } from 'next/server'
// import clientPromise from "../../../../lib/mongodb";
// import { ObjectId } from 'mongodb';
import db from "../../../../lib/drizzleOrmDb.js";
import { reviews } from '../../../../../drizzle/schema.ts';
import { and, eq } from 'drizzle-orm';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import { withSession } from 'supertokens-node/nextjs/index.js';

ensureSuperTokensInit();

export async function GET(request, { params }) {

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

        // const account = await db.collection("accounts").findOne({ "username": "Lorenzo" });
        // const reviewsById = await db.collection("reviews").find({ "account_id": new ObjectId(account._id), "element_id": parseInt(reviewId) }).toArray();

        return NextResponse.json(reviewsByElementId);
    });
}