import Joi from "joi";
import { ServiceData } from "../services/categoryService";

const categorySchema = Joi.object<ServiceData>({
    title: Joi.string().required(),
});

export default categorySchema;
