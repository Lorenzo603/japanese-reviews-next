import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
    console.log("Getting last selected level...");
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts").find({ "username": "Lorenzo" }).toArray();
    // console.log("Getting last selected level DB response:", response);
    return NextResponse.json(response[0].last_selected_level);
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