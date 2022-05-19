import { Request, Response } from "express";
import * as calendarService from "../services/calendarService.js";

export async function createEvent(req: Request, res: Response) {
    await calendarService.create(req.body);

    return res.sendStatus(201);
}

export async function getFreeBusy(req: Request, res: Response) {
    const freeBusy = await calendarService.getFreeBusy(req.body);

    return res.status(200).send(freeBusy);
}
