import { Request, Response } from "express";
import * as scheduleService from "../services/scheduleService.js";

export async function editSchedule(req: Request, res: Response) {
    const { weekId } = req.params;

    await scheduleService.edit(req.body, +weekId);

    res.sendStatus(200);
}
