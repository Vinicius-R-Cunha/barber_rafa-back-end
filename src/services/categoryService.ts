import * as categoryRepository from "../repositories/categoryRepository.js";
import { stripHtml } from "string-strip-html";

export interface CategoryData {
    title: string;
}

export async function create(title: string) {
    const titleStrip = stripHtml(title).result.trim();

    if (await categoryExists(titleStrip)) {
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

    if (!(await categoryExists(title))) {
        throw {
            type: "not_found",
            message: "category not found",
        };
    }

    return category?.services.length === 0;
}

export async function edit(categoryTitle: string, title: string) {
    const oldTitle = stripHtml(categoryTitle).result.trim();
    const newTitle = stripHtml(title).result.trim();

    if (!(await categoryExists(oldTitle))) {
        throw {
            type: "not_found",
            message: "category not found",
        };
    }

    if (await categoryExists(newTitle)) {
        throw {
            type: "conflict",
            message: "there is a category with this name already",
        };
    }

    await categoryRepository.editTitle(oldTitle, newTitle);
}

async function categoryExists(title: string) {
    return await categoryRepository.getByTitle(title);
}
