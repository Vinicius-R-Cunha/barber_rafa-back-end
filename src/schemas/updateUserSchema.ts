import Joi from "joi";
import { UpdateUserData } from "../services/userService";

const UpdateUserSchema = Joi.object<UpdateUserData>({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().trim().min(15).max(15),
});

export default UpdateUserSchema;
