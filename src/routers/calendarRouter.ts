import { Router } from "express";
import * as calendarController from "../controllers/calendarController.js";

const calendarRouter = Router();

calendarRouter.post("/calendar", calendarController.getUpcoming);

export default calendarRouter;
