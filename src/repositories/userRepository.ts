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

export async function createNewGoogleUser(
  googleId: string,
  name: string,
  email: string,
  phone: string
) {
  return await db
    .collection("users")
    .insertOne({ googleId, name, email, phone, reservations: [] });
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

export async function changeName(email: string, name: string) {
  return await db.collection("users").updateOne(
    {
      email,
    },
    {
      $set: { name },
    }
  );
}

export async function changeEmail(email: string, newEmail: string) {
  return await db.collection("users").updateOne(
    {
      email,
    },
    {
      $set: { email: newEmail },
    }
  );
}

export async function removeUser(email: string) {
  return await db.collection("users").deleteOne({ email });
}
