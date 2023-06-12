import { NextResponse } from 'next/server'
import clientPromise from "../../../lib/mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("japanese-reviews");
    const data = await db.collection("accounts").find({}).toArray();
    return NextResponse.json(data);
}