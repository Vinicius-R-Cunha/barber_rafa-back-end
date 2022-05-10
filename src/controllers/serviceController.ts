import { Request, Response } from "express";
import * as serviceService from "../services/serviceService.js";

export async function create(req: Request, res: Response) {
    const { categoryTitle } = req.params;

    await serviceService.create(req.body, categoryTitle);

    res.sendStatus(201);
}

export async function edit(req: Request, res: Response) {
    const { categoryTitle, serviceName } = req.params;

    await serviceService.edit(serviceName, req.body, categoryTitle);

    res.sendStatus(200);
}

export async function deleteService(req: Request, res: Response) {
    const { categoryTitle, serviceName } = req.params;

    await serviceService.deleteService(categoryTitle, serviceName);

    res.sendStatus(200);
}
