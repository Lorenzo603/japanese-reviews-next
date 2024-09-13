import { NextResponse } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/app/(auth)/sign-in/config/backend.js";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import EmailVerification from "supertokens-node/recipe/emailverification";
import { isEmailChangeAllowed } from "supertokens-node/recipe/accountlinking"
import supertokens from "supertokens-node";

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
        const password = reqJson.password;

        // Validate the input email
        if (!isValidEmail(email)) {
            // handle invalid email error
            return NextResponse.json({
                error: 'Internal Server Error',
                message: 'Email is invalid.',
            }, { status: 400 })
        }

        // get the signed in user's old email from the getUserById function
        let userInfo = await supertokens.getUser(session.getUserId())
        if (userInfo === undefined) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
        let loginMethod = userInfo.loginMethods.find((lM) => lM.recipeUserId.getAsString() === session.getRecipeUserId().getAsString() && lM.recipeId === "emailpassword");
        if (loginMethod === undefined) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
        const oldEmail = loginMethod.email;
        // call signin to check that input password is correct
        let isPasswordValid = await EmailPassword.verifyCredentials(session.getTenantId(), oldEmail, password)
        if (isPasswordValid.status !== "OK") {
            // handle incorrect password error
            return NextResponse.json({
                error: 'Internal Server Error',
                message: 'Incorrect password.',
            }, { status: 400 })
        }

        // TODO: Reenable Email verification
        // // Then, we check if the email is verified for this user ID or not.
        // // It is important to understand that SuperTokens stores email verification
        // // status based on the user ID AND the email, and not just the email.
        // let isVerified = await EmailVerification.isEmailVerified(session.getRecipeUserId(), email);
        // if (!isVerified) {
        //     if (!(await isEmailChangeAllowed(session.getRecipeUserId(), email, false))) {
        //         // this can come here if you have enabled the account linking feature, and 
        //         // if there is a security risk in changing this user's email.
        //         return NextResponse.json({
        //             error: 'Internal Server Error',
        //             message: 'Email change not allowed. Please contact support.',
        //         }, { status: 400 })
        //     } 

        //     // Before sending a verification email, we check if the email is already
        //     // being used by another user. If it is, we throw an error.
        //     let user = await supertokens.getUser(session.getUserId());
        //     if (!user) {
        //         return NextResponse.json({
        //             error: 'Internal Server Error',
        //             message: 'User not found.',
        //         }, { status: 400 })
        //     }
        //     for (let i = 0; i < user.tenantIds.length; i++) {
        //         let usersWithSameEmail = await supertokens.listUsersByAccountInfo(user.tenantIds[i], {
        //             email
        //         });
        //         for (let y = 0; y < usersWithSameEmail.length; y++) {
        //             // Since one user can be shared across many tenants, we need to check if
        //             // the email already exists in any of the tenants that belongs to this user.
        //             let currUser = usersWithSameEmail[y];
        //             if (currUser?.id !== session.getUserId()) {
        //                 // TODO handle error, email already exists with another user.
        //                 return NextResponse.json({
        //                     error: 'Internal Server Error',
        //                     message: 'Email already exists.',
        //                 }, { status: 400 })
        //             }
        //         }
        //     }

        //     // Now we create and send the email verification link to the user for the new email.
        //     await EmailVerification.sendEmailVerificationEmail(session.getTenantId(), session.getUserId(), session.getRecipeUserId(), email);

        //     // TODO send successful response that email verification email sent.
        //     return NextResponse.json({
        //         status: 'VERIFICATION_EMAIL_SENT',
        //         message: 'Verification email sent.',
        //     }, { status: 200 })
        // }

        // Update the email
        let resp = await EmailPassword.updateEmailOrPassword({
            recipeUserId: session.getRecipeUserId(),
            email: email,
        });

        if (resp.status === "OK") {
            // send successfully updated email response
            return NextResponse.json({
                status: 'OK',
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