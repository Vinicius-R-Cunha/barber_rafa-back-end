import { Router } from "express";
import validateAdminMiddleware from "../middlewares/validateAdminMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import checkAvailabilitySchema from "../schemas/checkAvailabilitySchema.js";
import * as scheduleController from "../controllers/scheduleController.js";

const scheduleRouter = Router();
scheduleRouter.post(
    "/schedule/:weekId",
    validateSchemaMiddleware(checkAvailabilitySchema),
    validateAdminMiddleware,
    scheduleController.editSchedule
);

export default scheduleRouter;
