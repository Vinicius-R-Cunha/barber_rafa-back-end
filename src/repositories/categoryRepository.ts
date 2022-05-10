import { db } from "../database.js";

export async function insert(title: string) {
    return await db.collection("categories").insertOne({ title, services: [] });
}

export async function getAll() {
    return await db.collection("categories").find({}).toArray();
}

export async function getByTitle(title: string) {
    return await db.collection("categories").findOne({ title });
}
