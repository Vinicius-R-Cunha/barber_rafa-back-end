import Joi from "joi";
import { ServiceData } from "../services/serviceService";

const serviceSchema = Joi.object<ServiceData>({
    name: Joi.string().required(),
    price: Joi.number().required(),
    duration: Joi.string().required(),
    description: Joi.string().required(),
});

export default serviceSchema;
