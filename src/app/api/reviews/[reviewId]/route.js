import { NextResponse } from 'next/server'
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    const reviewId = params.reviewId;
    console.log(`Getting review with id ${reviewId}...`);

    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const account = await db.collection("accounts").findOne({ "username": "Lorenzo" });
    const reviewsById = await db.collection("reviews").find({ "account_id": new ObjectId(account._id), "element_id": parseInt(reviewId) }).toArray();
    return NextResponse.json(reviewsById);
}