import { NextResponse } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/app/(auth)/sign-in/config/backend.js";
import EmailPassword from "supertokens-node/recipe/emailpassword";

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

        const email = reqJson.newEmail;
        // console.log(`Updating email to: ${email}`);
        
        // Validate the input email
        if (!isValidEmail(email)) {
            // handle invalid email error
            return NextResponse.json({
                error: 'Internal Server Error',
                message: 'Email is invalid.',
            }, { status: 400 })
        }

        // Update the email
        let resp = await EmailPassword.updateEmailOrPassword({
            recipeUserId: session.getRecipeUserId(),
            email: email,
        });

        if (resp.status === "OK") {
            // send successfully updated email response
            return NextResponse.json({
                email: email,
            }, { status: 200 })
        }
        if (resp.status === "EMAIL_ALREADY_EXISTS_ERROR") {
            // handle error that email exists with another account.
            return NextResponse.json({
                error: 'Internal Server Error',
                message: 'Email already exists.',
            }, { status: 400 })
        }
        if (resp.status === "EMAIL_CHANGE_NOT_ALLOWED_ERROR") {
            // This is possible if you have enabled account linking.
            // See our docs for account linking to know more about this. 
            // TODO: tell the user to contact support.
            return NextResponse.json({
                error: 'Internal Server Error',
                message: 'Email change not allowed. Please contact support.',
            }, { status: 400 })
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    });
}

function isValidEmail(email) {
    const regexp = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(email);
}