import { Router } from "express";
import * as oAuthController from "../controllers/oAuthController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import oAuthSchema from "../schemas/oAuthSchema.js";

const oAuthRouter = Router();

oAuthRouter.post(
  "/oAuth/:oAuthType",
  validateSchemaMiddleware(oAuthSchema),
  oAuthController.handleOAuth
);

export default oAuthRouter;
