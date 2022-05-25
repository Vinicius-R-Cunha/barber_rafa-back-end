import { ObjectId } from "mongodb";
import { db } from "../database.js";

export async function insertOnUserByEmail(
    email: string,
    summary: string,
    startTime: string,
    endTime: string
) {
    return await db.collection("users").updateOne(
        {
            email,
        },
        {
            $push: {
                reservations: {
                    _id: new ObjectId(),
                    summary,
                    startTime,
                    endTime,
                },
            },
        }
    );
}

export async function remove(email: string, reservationId: string) {
    return await db.collection("users").updateOne(
        {
            email,
        },
        {
            $pull: {
                reservations: {
                    _id: new ObjectId(reservationId),
                },
            },
        }
    );
}

export async function getByEmail(email: string) {
    const user = await db.collection("users").findOne({ email });
    return user.reservations;
}
