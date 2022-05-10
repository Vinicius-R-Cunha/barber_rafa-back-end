import { Router } from "express";
import * as serviceController from "../controllers/serviceController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateTokenMiddleware from "../middlewares/validateTokenMiddleware.js";
import serviceSchema from "../schemas/serviceSchema.js";

const serviceRouter = Router();

serviceRouter.post(
    "/services/:categoryTitle",
    validateSchemaMiddleware(serviceSchema),
    validateTokenMiddleware,
    serviceController.create
);

serviceRouter.put(
    "/services/:categoryTitle/:serviceName",
    validateSchemaMiddleware(serviceSchema),
    validateTokenMiddleware,
    serviceController.edit
);

serviceRouter.delete(
    "/services/:categoryTitle/:serviceName",
    validateTokenMiddleware,
    serviceController.deleteService
);

export default serviceRouter;
