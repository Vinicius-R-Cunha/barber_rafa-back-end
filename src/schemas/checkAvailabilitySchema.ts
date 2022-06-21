import Joi from "joi";
import { CheckAvailabilityData } from "../services/calendarService.js";

const checkAvailability = Joi.object<CheckAvailabilityData>({
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  duration: Joi.string().required(),
});

export default checkAvailability;
