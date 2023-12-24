import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
    console.log("Getting last selected level...");
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const account = await db.collection("accounts").findOne({ "username": "Lorenzo" });
    // console.log("Getting last selected level DB response:", account);
    return NextResponse.json(account.last_selected_level);
}

export async function POST(request) {
    console.log("Updating lastSelectedLevel...");
    const reqJson = await request.json();
    // console.log("reqJson:", reqJson)
    
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts")
        .updateOne(
            { "username": "Lorenzo" }, {
            $set: {
                "last_selected_level": reqJson["newLastSelectedLevel"]
            }
        });
    return NextResponse.json(response);
}