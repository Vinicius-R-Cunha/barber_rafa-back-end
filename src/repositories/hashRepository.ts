import { db } from "../database.js";

export async function create(uuid: string, email: string, expireDate: Date) {
  return await db.collection("hashes").insertOne({ uuid, email, expireDate });
}

export async function getByUuid(uuid: string) {
  return await db.collection("hashes").findOne({ uuid });
}

export async function remove(uuid: string) {
  return await db.collection("hashes").deleteOne({ uuid });
}
