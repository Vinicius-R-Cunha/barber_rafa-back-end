import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";
import { db } from "../../src/database.js";

type MissingDataService = "name" | "price" | "duration" | "description";

export function serviceBody(missing?: MissingDataService) {
  const name = faker.internet.password();
  const price = faker.commerce.price();
  const duration = faker.commerce.productMaterial();
  const description = faker.internet.password();

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

export async function insertService(categoryId: string | ObjectId) {
  const body = serviceBody();
  const serviceId = new ObjectId();

  await db.collection("categories").updateOne(
    {
      _id: new ObjectId(categoryId),
    },
    {
      $push: { services: { _id: serviceId, ...body } },
    }
  );

  return { body, serviceId };
}
