import { Request, Response } from "express";
import * as reservationService from "../services/reservationService.js";

export async function getReservationsByEmail(req: Request, res: Response) {
    const { user } = res.locals;

    const reservations = await reservationService.getReservationsByEmail(
        user.email
    );

    res.status(200).send(reservations);
}

export async function removeReservation(req: Request, res: Response) {
    const { user } = res.locals;
    const { reservationId } = req.params;

    await reservationService.remove(user.email, reservationId);

    res.sendStatus(200);
}
