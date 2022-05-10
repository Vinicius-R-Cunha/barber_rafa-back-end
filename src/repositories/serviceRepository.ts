import { ObjectId } from "mongodb";
import { db } from "../database.js";
import { ServiceData } from "../services/serviceService.js";

export async function createNewService(body: ServiceData, title: string) {
    return await db.collection("categories").updateOne(
        {
            title,
        },
        {
            $push: { services: { _id: new ObjectId(), ...body } },
        }
    );
}

export async function deleteService(title: string, name: string) {
    return await db.collection("categories").updateOne(
        {
            title,
        },
        {
            $pull: { services: { name } },
        }
    );
}
