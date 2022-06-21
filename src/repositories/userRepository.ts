import { db } from "../database.js";

export async function findByEmail(email: string) {
  return await db.collection("users").findOne({ email });
}

export async function createNewUser(
  name: string,
  email: string,
  phone: string,
  password: string
) {
  return await db
    .collection("users")
    .insertOne({ name, email, phone, password, reservations: [] });
}
