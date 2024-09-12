import { NextResponse } from "next/server";
import db from "../../../../../lib/drizzleOrmDb.js";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/app/(auth)/sign-in/config/backend.js";
import { users } from "../../../../../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import SuperTokens from "supertokens-node";

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
        let userInfo = await SuperTokens.getUser(userId)
        try {
            const username = await getUsername(userId);
            if (!username) {
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
            }

            return NextResponse.json({
                username: username,
                email: userInfo.emails[0],
            }, { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    });
}

async function getUsername(userId) {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.userId, userId));

    if (result.length === 0) {
        console.warn('No users found for userId: ' + userId);
        return undefined;
    }
    if (result.length > 1) {
        console.warn('Multiple user records found when getting user: ' + userId);
        return undefined;
    }

    return result[0].username;
}
