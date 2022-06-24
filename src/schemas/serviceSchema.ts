import Joi from "joi";
import { ServiceData } from "../services/serviceService";

const serviceSchema = Joi.object<ServiceData>({
  name: Joi.string().required(),
  price: Joi.string().required(),
  duration: Joi.string().required(),
  description: Joi.string().allow("").required(),
});

export default serviceSchema;
