import * as categoryRepository from "../repositories/categoryRepository.js";

export interface CategoryData {
    title: string;
}

export async function create(title: string) {
    const category = await categoryRepository.getByTitle(title);

    if (category)
        throw {
            type: "conflict",
            message: "there is a category with this name already",
        };

    await categoryRepository.insert(title);
}

export async function get() {
    return await categoryRepository.getAll();
}
