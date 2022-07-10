import { db } from "../database.js";

export async function findByEmail(email: string) {
  return await db.collection("users").findOne({ email });
}

export async function createNewFacebookUser(
  facebookId: string,
  name: string,
  email: string,
  phone: string
) {
  return await db
    .collection("users")
    .insertOne({ facebookId, name, email, phone, reservations: [] });
}

export async function findByFacebookId(facebookId: string) {
  return await db.collection("users").findOne({ facebookId });
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

export async function changePassword(email: string, password: string) {
  return await db.collection("users").updateOne(
    {
      email,
    },
    {
      $set: { password },
    }
  );
}

export async function changePhone(email: string, phone: string) {
  return await db.collection("users").updateOne(
    {
      email,
    },
    {
      $set: { phone },
    }
  );
}
