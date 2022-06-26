import * as categoryRepository from "../repositories/categoryRepository.js";
import { stripHtml } from "string-strip-html";
import { ObjectId } from "mongodb";

export interface CategoryData {
  title: string;
}

export async function create(title: string) {
  const titleStrip = stripHtml(title).result.trim();

  await categoryRepository.insert(titleStrip);
}

export async function get() {
  return await categoryRepository.getAll();
}

export async function deleteEmpty(categoryId: ObjectId) {
  if (!(await categoryIsEmpty(categoryId))) {
    throw {
      type: "bad_request",
      message: "Apague os serviços dessa categoria para excluir",
    };
  }

  await categoryRepository.remove(categoryId);
}

async function categoryIsEmpty(categoryId: ObjectId) {
  const category = await categoryRepository.getById(categoryId);

  if (!category) {
    throw {
      type: "not_found",
      message: "Categoria não encontrada",
    };
  }

  return category?.services.length === 0;
}

export async function edit(categoryId: ObjectId, title: string) {
  if (!(await categoryExists(categoryId))) {
    throw {
      type: "not_found",
      message: "Categoria não encontrada",
    };
  }

  const { _id } = await categoryRepository.getById(categoryId);
  const newTitle = stripHtml(title).result.trim();

  await categoryRepository.editTitle(_id, newTitle);
}

async function categoryExists(categoryId: ObjectId) {
  return await categoryRepository.getById(categoryId);
}
