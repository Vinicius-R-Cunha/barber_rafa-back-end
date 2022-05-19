import Joi from "joi";
import { CalendarData } from "../services/calendarService.js";

const calendarSchema = Joi.object<CalendarData>({
    summary: Joi.string().required(),
    description: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
});

export default calendarSchema;
