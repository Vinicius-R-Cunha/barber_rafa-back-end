import Joi from "joi";
import { oAuthData } from "../services/oAuthService";

const oAuthSchema = Joi.object<oAuthData>({
  id: Joi.string(),
  name: Joi.string(),
  email: Joi.string().allow(""),
  phone: Joi.string().allow(""),
});

export default oAuthSchema;
