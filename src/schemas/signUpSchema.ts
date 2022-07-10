import Joi from "joi";
import { SignUpData } from "../services/authService.js";

const signUpSchema = Joi.object<SignUpData>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(15).max(15).required(),
  password: Joi.string().min(8).required(),
});

export default signUpSchema;
