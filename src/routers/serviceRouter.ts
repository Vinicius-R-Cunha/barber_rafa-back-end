import { Router } from "express";
import * as serviceController from "../controllers/serviceController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateAdminMiddleware from "../middlewares/validateAdminMiddleware.js";
import serviceSchema from "../schemas/serviceSchema.js";

const serviceRouter = Router();

serviceRouter.post(
    "/services/:categoryTitle",
    validateSchemaMiddleware(serviceSchema),
    validateAdminMiddleware,
    serviceController.create
);

serviceRouter.put(
    "/services/:categoryTitle/:serviceName",
    validateSchemaMiddleware(serviceSchema),
    validateAdminMiddleware,
    serviceController.edit
);

serviceRouter.delete(
    "/services/:categoryTitle/:serviceName",
    validateAdminMiddleware,
    serviceController.deleteService
);

export default serviceRouter;
