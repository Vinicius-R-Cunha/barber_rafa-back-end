import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import * as categoryService from "../services/categoryService.js";

export async function create(req: Request, res: Response) {
  const { title } = req.body;

  await categoryService.create(title);

  return res.sendStatus(201);
}

export async function get(req: Request, res: Response) {
  const categories = await categoryService.get();

  return res.status(200).send(categories);
}

export async function deleteEmpty(req: Request, res: Response) {
  const { categoryId } = req.params;

  await categoryService.deleteEmpty(new ObjectId(categoryId));

  return res.sendStatus(200);
}

export async function edit(req: Request, res: Response) {
  const { categoryId } = req.params;
  const { title } = req.body;

  await categoryService.edit(new ObjectId(categoryId), title);

  return res.sendStatus(200);
}
