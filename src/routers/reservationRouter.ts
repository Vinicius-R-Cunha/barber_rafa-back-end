import { Router } from "express";
import validateTokenMiddleware from "../middlewares/validateTokenMiddleware.js";
import * as reservationController from "../controllers/reservationController.js";

const reservationRouter = Router();
reservationRouter.get(
    "/reservations",
    validateTokenMiddleware,
    reservationController.getReservationsByEmail
);

reservationRouter.delete(
    "/reservations/:eventId",
    validateTokenMiddleware,
    reservationController.removeReservation
);

export default reservationRouter;
