import * as categoryRepository from "../repositories/categoryRepository.js";
import * as serviceRepository from "../repositories/serviceRepository.js";
import { stripHtml } from "string-strip-html";

export interface ServiceData {
  name: string;
  price: number;
  duration: string;
  description: string;
}

export async function create(body: ServiceData, categoryTitle: string) {
  const bodyStrip = {
    name: stripHtml(body.name).result.trim(),
    price: body.price,
    duration: stripHtml(body.duration).result.trim(),
    description: stripHtml(body.description).result.trim(),
  };

  if (await serviceExists(categoryTitle, bodyStrip.name))
    throw {
      type: "conflict",
      message: "there is a service with this name already",
    };

  await serviceRepository.createNewService(bodyStrip, categoryTitle);
}

export async function edit(
  oldServiceName: string,
  body: ServiceData,
  categoryTitle: string
) {
  const bodyStrip = {
    name: stripHtml(body.name).result.trim(),
    price: body.price,
    duration: stripHtml(body.duration).result.trim(),
    description: stripHtml(body.description).result.trim(),
  };

  const oldServiceNameStrip = stripHtml(oldServiceName).result.trim();
  const categoryTitleStrip = stripHtml(categoryTitle).result.trim();

  if (!(await serviceExists(categoryTitleStrip, oldServiceNameStrip)))
    throw { type: "not_found", message: "service not found" };

  if (
    await serviceExists(categoryTitleStrip, bodyStrip.name, oldServiceNameStrip)
  )
    throw {
      type: "conflict",
      message: "there is a service with this name already",
    };

  await serviceRepository.editService(
    oldServiceNameStrip,
    bodyStrip,
    categoryTitleStrip
  );
}

export async function deleteService(
  categoryTitle: string,
  serviceName: string
) {
  if (!(await serviceExists(categoryTitle, serviceName)))
    throw { type: "not_found", message: "service not found" };

  await serviceRepository.deleteService(categoryTitle, serviceName);
}

async function validateCategory(categoryTitle: string) {
  const category = await categoryRepository.getByTitle(categoryTitle);

  if (!category) throw { type: "not_found", message: "category not found" };

  return category;
}

async function serviceExists(
  categoryTitle: string,
  serviceName: string,
  oldServiceName?: string
) {
  const category = await validateCategory(categoryTitle);
  let serviceExists = false;
  for (let i = 0; i < category?.services?.length; i++) {
    if (category?.services[i]?.name === oldServiceName) continue;
    if (category?.services[i]?.name === serviceName) {
      serviceExists = true;
    }
  }

  return serviceExists;
}
