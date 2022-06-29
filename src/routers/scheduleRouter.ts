import { Router } from "express";
import validateAdminMiddleware from "../middlewares/validateAdminMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import scheduleSchema from "../schemas/scheduleSchema.js";
import * as scheduleController from "../controllers/scheduleController.js";

const scheduleRouter = Router();

scheduleRouter.get("/schedules", scheduleController.getSchedules);

scheduleRouter.post(
  "/schedule/:weekId",
  validateSchemaMiddleware(scheduleSchema),
  validateAdminMiddleware,
  scheduleController.editSchedule
);

export default scheduleRouter;
