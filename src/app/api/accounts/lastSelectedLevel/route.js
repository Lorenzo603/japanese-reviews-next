import { NextResponse } from 'next/server'
// import clientPromise from "../../../../lib/mongodb";
import db from "../../../../lib/drizzleOrmDb.js";
import { users } from '../../../../../drizzle/schema.ts';
import { withSession } from 'supertokens-node/nextjs/index.js';
import { eq } from 'drizzle-orm';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';

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
        console.log("Getting last selected level for user:", userId);
        const queryResult = await db
            .select()
            .from(users)
            .where(eq(users.userId, userId));

        if (queryResult.length === 0) {
            console.warn('User not found:', userId);
            return NextResponse.json({}, { status: 400 });
        }

        return NextResponse.json(queryResult[0].lastSelectedLevel, { status: 200 });
    });
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
        console.log("Updating lastSelectedLevel for user:", userId);

        const reqJson = await request.json();
        // console.log("reqJson:", reqJson)

        const result = await db.update(users)
            .set({ lastSelectedLevel: reqJson["newLastSelectedLevel"] })
            .where(eq(users.userId, userId));
        if (result.rowCount === 0) {
            console.warn('Could not update lastSelectedLevel for user', userId);
            return NextResponse.json({ error: 'Bad request' }, { status: 400 })
        }
        // const response = await db.collection("accounts")
        //     .updateOne(
        //         { "username": "Lorenzo" }, {
        //         $set: {
        //             "last_selected_level": reqJson["newLastSelectedLevel"]
        //         }
        //     });
        return NextResponse.json({message: "OK"}, { status: 200 });
    });

}