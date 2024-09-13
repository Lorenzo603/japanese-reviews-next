import { NextResponse } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/app/(auth)/sign-in/config/backend.js";
import { users } from "../../../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "@/lib/drizzleOrmDb";

ensureSuperTokensInit();

export async function POST(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        const reqJson = await request.json();

        const username = reqJson.newUsername;
        // console.log(`Updating username to: ${username}`);

        // Validate the input username
        const usernameViolations = validateUsername(username);
        if (usernameViolations !== undefined) {
            // handle invalid username error
            return NextResponse.json({
                error: 'Internal Server Error',
                message: usernameViolations,
            }, { status: 400 })
        }

        // Update the username
        const userId = session.getUserId();
        try {
            const result = await db.update(users)
                .set({ username: username })
                .where(eq(users.userId, userId));
            if (result.rowCount !== 1) {
                console.warn(`User not found for user: ${userId}, cannot update username`);
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
            }
            return NextResponse.json({
                username: username,
            }, { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

    });
}

function validateUsername(username) {
    if (username.length < 3) {
        return "Username must be at least 3 characters long";
    }
    if (username.length > 20) {
        return "Username must be less than 20 characters long";
    }
    return undefined
}