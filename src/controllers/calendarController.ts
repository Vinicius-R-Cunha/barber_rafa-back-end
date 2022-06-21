import { Request, Response } from "express";
import * as calendarService from "../services/calendarService.js";

export async function createEvent(req: Request, res: Response) {
  const { user } = res.locals;

  await calendarService.create(req.body, user.email);

  return res.sendStatus(201);
}

export async function checkAvailability(req: Request, res: Response) {
  const available = await calendarService.checkAvailability(req.body);

  return res.status(200).send(available);
}

export async function deleteEvent(req: Request, res: Response) {
  const { user } = res.locals;
  const { eventId } = req.params;

  await calendarService.remove(user.email, eventId);

  res.sendStatus(200);
}
