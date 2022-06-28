import { Request, Response } from "express";
import * as resetPasswordService from "../services/resetPasswordService.js";

export async function resetPassword(req: Request, res: Response) {
  const { hash } = req.params;

  await resetPasswordService.reset(req.body, hash);

  return res.sendStatus(200);
}

export async function generateUrl(req: Request, res: Response) {
  const { email } = req.params;

  await resetPasswordService.generateUrl(email);

  return res.sendStatus(200);
}

export async function validateHash(req: Request, res: Response) {
  const { hash } = req.params;

  await resetPasswordService.validateHash(hash);

  return res.sendStatus(200);
}
