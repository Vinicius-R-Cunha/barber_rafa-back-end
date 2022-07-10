import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateTokenMiddleware from "../middlewares/validateTokenMiddleware.js";
import signUpSchema from "../schemas/signUpSchema.js";
import signInSchema from "../schemas/signInSchema.js";
import UpdateUserSchema from "../schemas/updateUserSchema.js";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  validateSchemaMiddleware(signUpSchema),
  authController.signUp
);

authRouter.post(
  "/sign-in",
  validateSchemaMiddleware(signInSchema),
  authController.signIn
);

authRouter.post(
  "/token/validation",
  validateTokenMiddleware,
  authController.checkToken
);

authRouter.put(
  "/update-user",
  validateSchemaMiddleware(UpdateUserSchema),
  validateTokenMiddleware,
  authController.updateUserPhone
);

export default authRouter;
