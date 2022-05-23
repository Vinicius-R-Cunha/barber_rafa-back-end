import { ObjectId } from "mongodb";
import { db } from "../database.js";

export async function insertOnUserByEmail(
    email: string,
    summary: string,
    startTime: string
) {
    return await db.collection("users").updateOne(
        {
            email,
        },
        {
            $push: {
                reservations: { _id: new ObjectId(), summary, startTime },
            },
        }
    );
}
