import { ObjectId } from "mongodb";
import { db } from "../database.js";
import { ServiceData } from "../services/serviceService.js";

export async function createNewService(
  body: ServiceData,
  categoryId: ObjectId
) {
  return await db.collection("categories").updateOne(
    {
      _id: categoryId,
    },
    {
      $push: { services: { _id: new ObjectId(), ...body } },
    }
  );
}

export async function editService(
  categoryId: ObjectId,
  serviceId: ObjectId,
  body: ServiceData
) {
  return await db.collection("categories").updateOne(
    {
      _id: categoryId,
      "services._id": serviceId,
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

export async function deleteService(categoryId: ObjectId, serviceId: ObjectId) {
  return await db.collection("categories").updateOne(
    {
      _id: categoryId,
    },
    {
      $pull: { services: { _id: serviceId } },
    }
  );
}
