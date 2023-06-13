import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";

export async function POST(request) {
    const reqJson = await request.json();
    console.log("Add review payload:", reqJson)
    
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts")
        .updateOne(
            { "name": "Lorenzo" }, {
            $addToSet: {
                "reviews": reqJson
            }
        });
    return NextResponse.json(response);
}