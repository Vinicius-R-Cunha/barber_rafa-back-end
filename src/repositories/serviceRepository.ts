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

export async function editService(
    oldServiceName: string,
    body: ServiceData,
    title: string
) {
    return await db.collection("categories").updateOne(
        {
            title,
            "services.name": oldServiceName,
        },
        {
            $set: {
                "services.$.name": body.name,
                "services.$.price": body.price,
                "services.$.duration": body.duration,
                "services.$.description": body.description,
            },
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
