import { Router } from "express";
import * as calendarController from "../controllers/calendarController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateTokenMiddleware from "../middlewares/validateTokenMiddleware.js";
import calendarSchema from "../schemas/calendarSchema.js";
import checkAvailabilitySchema from "../schemas/checkAvailabilitySchema.js";

const calendarRouter = Router();

calendarRouter.post(
    "/calendar/create-event",
    validateSchemaMiddleware(calendarSchema),
    validateTokenMiddleware,
    calendarController.createEvent
);

calendarRouter.post(
    "/calendar/check-availability",
    validateSchemaMiddleware(checkAvailabilitySchema),
    validateTokenMiddleware,
    calendarController.checkAvailability
);

export default calendarRouter;
