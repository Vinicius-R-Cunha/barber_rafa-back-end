import { Router } from "express";
import * as calendarController from "../controllers/calendarController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateTokenMiddleware from "../middlewares/validateTokenMiddleware.js";
import calendarSchema from "../schemas/calendarSchema.js";

const calendarRouter = Router();

calendarRouter.post(
    "/calendar/create-event",
    validateSchemaMiddleware(calendarSchema),
    validateTokenMiddleware,
    calendarController.createEvent
);

export default calendarRouter;
