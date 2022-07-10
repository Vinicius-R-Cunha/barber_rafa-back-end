import Joi from "joi";
import { UpdatePhoneData } from "../services/authService";

const UpdateUserSchema = Joi.object<UpdatePhoneData>({
  phone: Joi.string().trim().min(15).max(15).required(),
});

export default UpdateUserSchema;
