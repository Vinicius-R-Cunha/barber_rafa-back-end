import Joi from "joi";
import { oAuthData } from "../services/oAuthService";

const oAuthSchema = Joi.object<oAuthData>({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().allow("").required(),
  phone: Joi.string().allow("").required(),
});

export default oAuthSchema;
