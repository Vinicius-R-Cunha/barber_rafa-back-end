import Joi from "joi";
import { CategoryData } from "../services/categoryService";

const categorySchema = Joi.object<CategoryData>({
  title: Joi.string().required(),
});

export default categorySchema;
