import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import * as serviceService from "../services/serviceService.js";

export async function create(req: Request, res: Response) {
  const { categoryId } = req.params;

  await serviceService.create(req.body, new ObjectId(categoryId));

  return res.sendStatus(201);
}

export async function edit(req: Request, res: Response) {
  const { categoryId, serviceId } = req.params;

  await serviceService.edit(
    new ObjectId(categoryId),
    req.body,
    new ObjectId(serviceId)
  );

  return res.sendStatus(200);
}

export async function deleteController(req: Request, res: Response) {
  const { categoryId, serviceId } = req.params;

  await serviceService.deleteService(
    new ObjectId(categoryId),
    new ObjectId(serviceId)
  );

  return res.sendStatus(200);
}
