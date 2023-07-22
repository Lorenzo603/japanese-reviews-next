import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";
import { createSession } from '../../../../services/SessionService'

export async function POST(request) {
    const reqJson = await request.json();
    console.log("Login payload:", reqJson);

    const username = reqJson.username;
    const password = reqJson.password;

    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const accounts = await db.collection("accounts").find({ "username": username }).toArray();
    // const accounts = [{'_id': 'aaa', 'password': 'ASDasd123'}];

    if (accounts.length === 0) {
        console.log("No account for username:", username);
        return NextResponse.json({ error: 'Error' }, { status: 400 });
    }

    const account = accounts[0];
    if (calculateHash(password) !== account.password) {
        console.log("Password mismatch for username:", username);
        return NextResponse.json({ error: 'Error' }, { status: 400 });
    }
    
    return NextResponse.json(
        {
            message: 'User authenticated',
            sessionId: await createSession(account._id.toString())
        },
        { status: 200 }
    );
}

// TODO calculate hash
function calculateHash(password) {
    return password;
}
