import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";

export async function POST(request) {
    const reqJson = await request.json();
    console.log("Login payload:", reqJson);
    
    const username = reqJson.username;
    const password = reqJson.password;

    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const accounts = await db.collection("accounts").find({ "username": username }).toArray();
    
    if (accounts.length === 0) {
        console.log("No account for username:", username);
        return NextResponse.json({ error: 'Error' }, { status: 400 });
    }

    const account = accounts[0];
    if (calculateHash(password) !== account.password) {
        console.log("Password mismatch for username:", username);
        return NextResponse.json({ error: 'Error' }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'User authenticated' }, { status: 200 });
}

function calculateHash(password) {
    return password;
}
