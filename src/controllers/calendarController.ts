import { Request, Response } from "express";
import * as calendarService from "../services/calendarService.js";

export async function createEvent(req: Request, res: Response) {
    await calendarService.create(req.body);

    return res.sendStatus(200);
}
