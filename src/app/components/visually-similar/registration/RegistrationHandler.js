import db from "@/lib/drizzleOrmDb.js";
import { userSettings } from "../../../../../drizzle/schema.ts";

export const addUserSettingsUponRegistration = async (userId) => {
    console.log(`Adding user settings on SignUp for user: ${userId}`);
    await db.insert(userSettings)
        .values(
            {
                userId: userId,
            }
        );
}