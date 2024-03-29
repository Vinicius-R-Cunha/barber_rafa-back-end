import { Request, Response } from "express";
import * as oAuthService from "../services/oAuthService.js";

export async function handleOAuth(req: Request, res: Response) {
  const { oAuthType } = req.params;

  const response = await oAuthService.handleOAuth(req.body, oAuthType);

  res.status(200).send(response);
}
