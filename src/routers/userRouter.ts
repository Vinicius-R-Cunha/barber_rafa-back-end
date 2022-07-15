import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateTokenMiddleware from "../middlewares/validateTokenMiddleware.js";
import UpdateUserSchema from "../schemas/updateUserSchema.js";

const userRouter = Router();

userRouter.put(
  "/update-user",
  validateSchemaMiddleware(UpdateUserSchema),
  validateTokenMiddleware,
  userController.updateUserData
);

export default userRouter;
