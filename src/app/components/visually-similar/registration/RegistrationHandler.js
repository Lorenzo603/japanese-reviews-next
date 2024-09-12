import db from "@/lib/drizzleOrmDb.js";
import { users, userSettings } from "../../../../../drizzle/schema.ts";

export const createUserSettings = async (userId) => {
    console.log(`Creating user settings for user: ${userId}`);
    await db.insert(userSettings)
        .values(
            {
                userId: userId,
            }
        );
}


export const createUser = async (userId,username) => {
    console.log(`Creating user: ${userId}`);
    await db.insert(users)
        .values(
            {
                userId: userId,
                username: username,
            }
        );
}