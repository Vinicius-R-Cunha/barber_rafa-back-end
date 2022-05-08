import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { signUpSchema } from "../schemas/signUpSchema.js";

const authRouter = Router();
authRouter.post(
    "/sign-up",
    validateSchemaMiddleware(signUpSchema),
    authController.signUp
);
authRouter.post("/sign-in", authController.signIn);

export default authRouter;
