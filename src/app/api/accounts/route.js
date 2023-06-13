import { NextResponse } from 'next/server'
import clientPromise from "../../../lib/mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts").find({ "name": "Lorenzo" }).toArray();
    return NextResponse.json(response);
}

export async function POST(request) {
    const reqJson = await request.json();
    // console.log("reqJson:", reqJson)
    
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts")
        .updateOne(
            { "name": "Lorenzo" }, {
            $set: {
                "last_selected_level": reqJson["newLastSelectedLevel"]
            }
        });
    return NextResponse.json(response);
}