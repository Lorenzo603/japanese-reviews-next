import SuperTokens from "supertokens-node";
import { NextResponse } from "next/server";
import db from "../../../../../lib/drizzleOrmDb.js";
import { withSession } from "supertokens-node/nextjs";
import { backendConfig } from "@/app/(auth)/auth/config/backend.js";
import { userSettings } from "../../../../../../drizzle/schema.ts";
import { eq } from "drizzle-orm";

SuperTokens.init(backendConfig());

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
                .from(userSettings)
                .where(eq(userSettings.userId, userId));

            if (result.length === 0) {
                console.warn('No records found when getting userSettings of user: ' + userId);
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
            }
            if (result.length > 1) {
                console.warn('Multiple records found when getting userSettings of user: ' + userId);
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
            }

            return NextResponse.json(result[0], { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    });
}

export async function PATCH(request) {
    const reqJson = await request.json();

    const updateFieldsObject = reqJson;

    if (!updateFieldsObject) {
        return NextResponse.json({ message: 'Missing field or value' }, { status: 400 })
    }

    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }
        // let accessTokenPayload = session && session.getAccessTokenPayload();
        // let customClaimValue = accessTokenPayload.customClaim;

        const userId = session.getUserId();
        try {
            const result = await db.update(userSettings)
                .set(updateFieldsObject)
                .where(eq(userSettings.userId, userId));
            if (result.rowCount === 0) {
                console.warn('Record not found');
                return NextResponse.json({ message: 'OK' }, { status: 200 })
            }
            return NextResponse.json({ message: 'OK' }, { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    });



}