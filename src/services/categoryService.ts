import * as categoryRepository from "../repositories/categoryRepository.js";

export interface ServiceData {
    title: string;
}

export async function create(title: string) {
    await categoryRepository.insert(title.toUpperCase());
}

export async function get() {
    return await categoryRepository.getAll();
}
