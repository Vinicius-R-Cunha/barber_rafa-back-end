import * as categoryRepository from "../repositories/categoryRepository.js";

export interface CategoryData {
    title: string;
}

export async function create(title: string) {
    const category = await categoryRepository.getByTitle(title);

    if (category) {
        throw {
            type: "conflict",
            message: "there is a category with this name already",
        };
    }

    await categoryRepository.insert(title);
}

export async function get() {
    return await categoryRepository.getAll();
}

export async function deleteEmpty(title: string) {
    if (!(await categoryIsEmpty(title))) {
        throw {
            type: "bad_request",
            message: "can't delete a category that have services",
        };
    }

    await categoryRepository.remove(title);
}

async function categoryIsEmpty(title: string) {
    const category = await categoryRepository.getByTitle(title);

    if (!category) {
        throw {
            type: "not_found",
            message: "category not found",
        };
    }

    return category?.services.length === 0;
}
