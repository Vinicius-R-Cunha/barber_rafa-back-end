import { Request, Response } from "express";
import * as categoryService from "../services/categoryService.js";

export async function create(req: Request, res: Response) {
    const { title } = req.body;

    await categoryService.create(title);

    res.sendStatus(201);
}

export async function get(req: Request, res: Response) {
    const categories = await categoryService.get();

    res.status(200).send(categories);
}

export async function deleteEmpty(req: Request, res: Response) {
    const { categoryTitle } = req.params;

    const categories = await categoryService.deleteEmpty(categoryTitle);

    res.status(200).send(categories);
}
