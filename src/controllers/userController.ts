import { Request, Response } from "express";
import * as userService from "../services/userService.js";

export async function updateUserData(req: Request, res: Response) {
  const { type } = req.query as any;
  const { user } = res.locals;

  const token = await userService.updateUserData(user.email, req.body, type);

  return res.status(200).send(token);
}
