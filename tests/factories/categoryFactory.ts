import { faker } from "@faker-js/faker";
import { db } from "../../src/database.js";

type MissingDataCategory = "title";

export function categoryBody(missing?: MissingDataCategory) {
  const title = faker.internet.password();

  if (missing === "title") {
    return {};
  } else {
    return {
      title,
    };
  }
}

export async function insertCategory() {
  const body = categoryBody();

  const category = await db
    .collection("categories")
    .insertOne({ title: body.title, services: [] });

  return category;
}
