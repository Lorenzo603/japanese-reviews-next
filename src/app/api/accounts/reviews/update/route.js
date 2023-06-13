import { NextResponse } from 'next/server'
import clientPromise from "../../../../../lib/mongodb";

export async function POST(request) {
    const reqJson = await request.json();
    console.log("Update review payload:", reqJson)
    
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts")
        .updateOne(
            { "name": "Lorenzo", "reviews.element_id": reqJson.element_id }, {
            $set: {
                "reviews.$.current_srs_stage": reqJson.current_srs_stage,
                "reviews.$.unlock_date": reqJson.unlock_date,
            }
        });
    return NextResponse.json(response);
}