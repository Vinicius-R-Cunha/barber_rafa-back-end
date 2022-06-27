import { Router } from "express";
import * as resetPasswordController from "../controllers/resetPasswordController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import resetPasswordSchema from "../schemas/resetPasswordSchema.js";

const resetPasswordRouter = Router();

resetPasswordRouter.post(
  "/generate-reset-url/:email",
  resetPasswordController.generateUrl
);

resetPasswordRouter.post(
  "/reset-password/:hash",
  validateSchemaMiddleware(resetPasswordSchema),
  resetPasswordController.resetPassword
);

resetPasswordRouter.post(
  "/hash-validation/:hash",
  resetPasswordController.validateHash
);

export default resetPasswordRouter;
