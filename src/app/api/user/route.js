import { withSession } from "supertokens-node/nextjs";
import { NextResponse } from "next/server";
import { ensureSuperTokensInit } from '../../(auth)/sign-in/config/backend';

ensureSuperTokensInit();

export function GET(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            return NextResponse.json(err, { status: 500 });
        }
        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        return NextResponse.json({
            note: "Fetch any data from your application for authenticated user after using verifySession middleware",
            userId: session.getUserId(),
            sessionHandle: session.getHandle(),
            accessTokenPayload: session.getAccessTokenPayload(),
        });
    });
}