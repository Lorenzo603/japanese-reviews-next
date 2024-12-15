import db from "@/lib/drizzleOrmDb";
import { eq } from "drizzle-orm";
import { reviews } from "../../../../../drizzle/schema";


export const getPendingReviews = async (userId) => {
    console.log("Getting pending reviews BACKEND for user:", userId);
    const allUserReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.userId, userId));

    const transformedReviews = convertDateStringToDate(allUserReviews.filter(review => review.currentSrsStage < 9));

    const now = new Date();
    return transformedReviews.filter((review) => review.fullUnlockDate <= now);
}


function convertDateStringToDate(array) {
    const convertedArray = array.map(obj => {
        const fullUnlockDate = new Date(obj.unlockDate);
        return { ...obj, fullUnlockDate };
    });

    return convertedArray;
}