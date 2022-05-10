import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";
import { db } from "../../src/database.js";

type MissingDataService = "name" | "price" | "duration" | "description";

export function serviceBody(missing?: MissingDataService) {
    const name = faker.internet.password();
    const price = faker.commerce.price();
    const duration = faker.commerce.productMaterial();
    const description = faker.commerce.productDescription();

    if (missing === "name") {
        return {
            price,
            duration,
            description,
        };
    } else if (missing === "price") {
        return {
            name,
            duration,
            description,
        };
    } else if (missing === "duration") {
        return {
            name,
            price,
            description,
        };
    } else if (missing === "description") {
        return {
            name,
            price,
            duration,
        };
    } else {
        return {
            name,
            price,
            duration,
            description,
        };
    }
}

export async function insertService(title: string) {
    const body = serviceBody();

    await db.collection("categories").updateOne(
        {
            title,
        },
        {
            $push: { services: { _id: new ObjectId(), ...body } },
        }
    );

    return body;
}
