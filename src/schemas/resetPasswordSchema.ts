import Joi from "joi";
import { ResetPasswordData } from "../services/resetPasswordService";

const resetPasswordSchema = Joi.object<ResetPasswordData>({
  password: Joi.string().min(8).required(),
  passwordConfirmation: Joi.string().min(8).required(),
});

export default resetPasswordSchema;
