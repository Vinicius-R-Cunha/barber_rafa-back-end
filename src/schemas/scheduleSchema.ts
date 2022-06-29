import Joi from "joi";
import { ScheduleData } from "../services/scheduleService";

const scheduleSchema = Joi.object<ScheduleData>({
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  isOpen: Joi.boolean().required(),
});

export default scheduleSchema;
