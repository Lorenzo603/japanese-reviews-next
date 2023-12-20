import { NextResponse } from 'next/server'
import clientPromise from "../../../lib/mongodb";

export async function GET() {
    console.log("Getting account info...");
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const response = await db.collection("accounts").find({ "username": "Lorenzo" }).toArray();
    // console.log("Account info DB response:", response);
    return NextResponse.json(response);
}
