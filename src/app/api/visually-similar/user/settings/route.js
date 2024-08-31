import SuperTokens from "supertokens-node";
import { NextResponse } from "next/server";
import pool from "../../../../../lib/postgresDb.js";
import { withSession } from "supertokens-node/nextjs";
import { backendConfig } from "@/app/(auth)/auth/config/backend.js";

SuperTokens.init(backendConfig());

export async function PATCH(request) {
    const reqJson = await request.json();
    
    const field = "guess_kanji";
    const newValue = reqJson.guessKanji;

    if (!reqJson || newValue === undefined) {
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
            const result = await pool.query(`UPDATE user_settings SET ${field} = $1 WHERE user_id = $2`, [newValue, userId]);
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