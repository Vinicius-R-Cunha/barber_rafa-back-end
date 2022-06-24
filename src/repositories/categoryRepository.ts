import { ObjectId } from "mongodb";
import { db } from "../database.js";

export async function insert(title: string) {
  return await db.collection("categories").insertOne({ title, services: [] });
}

export async function getAll() {
  return await db.collection("categories").find({}).toArray();
}

export async function getById(categoryId: ObjectId) {
  return await db.collection("categories").findOne({ _id: categoryId });
}

export async function remove(categoryId: ObjectId) {
  return await db.collection("categories").deleteOne({ _id: categoryId });
}

export async function editTitle(_id: ObjectId, newTitle: string) {
  return await db.collection("categories").updateOne(
    {
      _id,
    },
    {
      $set: { title: newTitle },
    }
  );
}
