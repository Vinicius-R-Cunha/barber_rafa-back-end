import { Request, Response } from "express";
import * as calendarService from "../services/calendarService.js";

export async function getUpcoming(req: Request, res: Response) {
    const data = await calendarService.getEvents();

    return res.status(200).send(data);
}
