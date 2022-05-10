import * as categoryRepository from "../repositories/categoryRepository.js";

export interface ServiceData {
    name: string;
    price: number;
    duration: string;
    description: string;
}

export async function create(body: ServiceData, categoryTitle: string) {
    if (await validateCategoryService(categoryTitle, body.name))
        throw {
            type: "conflict",
            message: "there is a service with this name already",
        };

    await categoryRepository.createNewService(body, categoryTitle);
}

export async function deleteService(
    categoryTitle: string,
    serviceName: string
) {
    if (!(await validateCategoryService(categoryTitle, serviceName)))
        throw { type: "not_found", message: "service not found" };

    await categoryRepository.deleteService(categoryTitle, serviceName);
}

async function validateCategory(categoryTitle: string) {
    const category = await categoryRepository.getByTitle(categoryTitle);

    if (!category) throw { type: "not_found", message: "category not found" };

    return category;
}

async function validateCategoryService(
    categoryTitle: string,
    serviceName: string
) {
    const category = await validateCategory(categoryTitle);

    let serviceExists = false;
    for (let i = 0; i < category?.services?.length; i++) {
        if (category?.services[i]?.name === serviceName) {
            serviceExists = true;
        }
    }

    return serviceExists;
}
