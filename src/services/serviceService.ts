import * as categoryRepository from "../repositories/categoryRepository.js";
import * as serviceRepository from "../repositories/serviceRepository.js";
import { stripHtml } from "string-strip-html";
import { ObjectId } from "mongodb";

export interface ServiceData {
  name: string;
  price: string;
  duration: string;
  description: string;
}

export async function create(body: ServiceData, categoryId: ObjectId) {
  const bodyStrip = {
    name: strip(body.name),
    price: strip(body.price),
    duration: strip(body.duration),
    description: strip(body.description),
  };

  await validateCategory(categoryId);

  await serviceRepository.createNewService(bodyStrip, categoryId);
}

export async function edit(
  categoryId: ObjectId,
  body: ServiceData,
  serviceId: ObjectId
) {
  const bodyStrip = {
    name: strip(body.name),
    price: strip(body.price),
    duration: strip(body.duration),
    description: strip(body.description),
  };

  const categoryIdStrip = new ObjectId(strip(categoryId.toString()));
  const serviceIdStrip = new ObjectId(strip(serviceId.toString()));

  if (!(await serviceExists(categoryIdStrip, serviceIdStrip)))
    throw { type: "not_found", message: "Serviço não encontrado" };

  await serviceRepository.editService(
    categoryIdStrip,
    serviceIdStrip,
    bodyStrip
  );
}

export async function deleteService(categoryId: ObjectId, serviceId: ObjectId) {
  if (!(await serviceExists(categoryId, serviceId)))
    throw { type: "not_found", message: "Serviço não encontrado" };

  await serviceRepository.deleteService(categoryId, serviceId);
}

async function serviceExists(categoryId: ObjectId, serviceId: ObjectId) {
  const category = await validateCategory(categoryId);

  let serviceExists = false;
  for (let i = 0; i < category?.services?.length; i++) {
    if (new ObjectId(serviceId).equals(category?.services[i]?._id)) {
      serviceExists = true;
    }
  }

  return serviceExists;
}

async function validateCategory(categoryId: ObjectId) {
  const category = await categoryRepository.getById(categoryId);

  if (!category)
    throw { type: "not_found", message: "Categoria não encontrada" };

  return category;
}

function strip(string: string) {
  return stripHtml(string).result.trim();
}
