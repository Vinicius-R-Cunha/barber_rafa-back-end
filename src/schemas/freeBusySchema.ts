import Joi from "joi";
import { FreeBusyData } from "../services/calendarService.js";

const freeBusySchema = Joi.object<FreeBusyData>({
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
});

export default freeBusySchema;
